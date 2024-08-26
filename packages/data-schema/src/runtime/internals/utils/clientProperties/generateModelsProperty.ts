// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ModelTypes } from '../../../client';
import {
  BaseClient,
  BaseBrowserClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
} from '../../../bridge-types';

import { ModelOperation } from '../../APIClient';
import { listFactory } from '../../operations/list';
import { indexQueryFactory } from '../../operations/indexQuery';
import { getFactory } from '../../operations/get';
import { subscriptionFactory } from '../../operations/subscription';
import { observeQueryFactory } from '../../operations/observeQuery';
import {
  getSecondaryIndexesFromSchemaModel,
  excludeDisabledOps,
} from '../../clientUtils';

export function generateModelsProperty<T extends Record<any, any> = never>(
  client: BaseClient,
  apiGraphQLConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): ModelTypes<T> | ModelTypes<never> {
  const models = {} as any;

  const modelIntrospection: ModelIntrospectionSchema | undefined =
    apiGraphQLConfig.modelIntrospection;

  if (!modelIntrospection) {
    return {} as ModelTypes<never>;
  }

  const SUBSCRIPTION_OPS = ['ONCREATE', 'ONUPDATE', 'ONDELETE'];

  for (const model of Object.values(modelIntrospection.models)) {
    const { name } = model;

    models[name] = {} as Record<string, any>;

    const enabledModelOps = excludeDisabledOps(modelIntrospection, name);

    Object.entries(enabledModelOps).forEach(([key, { operationPrefix }]) => {
      const operation = key as ModelOperation;

      if (operation === 'LIST') {
        models[name][operationPrefix] = listFactory(
          client,
          modelIntrospection,
          model,
          getInternals,
        );
      } else if (SUBSCRIPTION_OPS.includes(operation)) {
        models[name][operationPrefix] = subscriptionFactory(
          client as BaseBrowserClient,
          modelIntrospection,
          model,
          operation,
          getInternals,
        );
      } else if (operation === 'OBSERVE_QUERY') {
        models[name][operationPrefix] = observeQueryFactory(models, model);
      } else {
        models[name][operationPrefix] = getFactory(
          client,
          modelIntrospection,
          model,
          operation,
          getInternals,
        );
      }
    });

    // If .list() has been disabled in the schema builder, we still need
    // an internal list on the model for the async getters
    // This method is absent from client types and only accessed in APIClient.ts
    if (!models[name].list) {
      models[name]['#list'] = listFactory(
        client,
        modelIntrospection,
        model,
        getInternals,
      );
    }

    const secondaryIdxs = getSecondaryIndexesFromSchemaModel(model);

    for (const idx of secondaryIdxs) {
      models[name][idx.queryField] = indexQueryFactory(
        client,
        modelIntrospection,
        model,
        idx,
        getInternals,
      );
    }
  }

  return models;
}
