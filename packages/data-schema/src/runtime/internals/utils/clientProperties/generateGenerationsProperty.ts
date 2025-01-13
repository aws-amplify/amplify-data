// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
} from '../../../bridge-types';
import { CustomQueries } from '../../../client';
import { customOpFactory } from '../../operations/custom';
import {
  AiAction,
  getCustomUserAgentDetails,
} from '../../ai/getCustomUserAgentDetails';

export function generateGenerationsProperty<T extends Record<any, any>>(
  client: BaseClient,
  apiGraphQLConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): CustomQueries<T> {
  const modelIntrospection: ModelIntrospectionSchema | undefined =
    apiGraphQLConfig?.modelIntrospection;

  // generations will be absent from model intro schema if no generation routes
  // are present on the source schema.
  if (!modelIntrospection?.generations) {
    return {} as CustomQueries<T>;
  }

  const generations: Record<string, any> = {};

  for (const generation of Object.values(modelIntrospection.generations)) {
    generations[generation.name] = customOpFactory(
      client,
      modelIntrospection,
      'query',
      generation,
      false,
      getInternals,
      getCustomUserAgentDetails(AiAction.Generation),
    );
  }

  return generations as CustomQueries<T>;
}
