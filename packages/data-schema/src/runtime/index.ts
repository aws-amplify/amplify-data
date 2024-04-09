// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isApiGraphQLConfig } from './internals/utils/runtimeTypeGuards/isApiGraphQLProviderConfig';
import {
  ClientExtensions,
  ClientExtensionsSSRCookies,
  ClientExtensionsSSRRequest,
} from './client';
import {
  generateCustomQueriesProperty,
  generateCustomMutationsProperty,
  generateCustomSubscriptionsProperty,
  generateEnumsProperty,
  generateModelsProperty,
} from './internals';
import { generateModelsProperty as generateModelsPropertyServer } from './internals/server';
import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
} from './bridge-types';
export {
  generateCustomQueriesProperty,
  generateCustomMutationsProperty,
  generateCustomSubscriptionsProperty,
  generateEnumsProperty,
  generateModelsProperty,
  isApiGraphQLConfig,
  isGraphQLResponseWithErrors,
  isConfigureEventWithResourceConfig,
} from './internals';

// TODO: separate import path
export function addSchemaToClientWithInstance<T extends Record<any, any>>(
  client: BaseClient,
  params: any,
  // params: ServerClientGenerationParams & CommonPublicClientOptions,
  getInternals: ClientInternalsGetter,
): BaseClient &
  (ClientExtensionsSSRCookies<T> | ClientExtensionsSSRRequest<T>) {
  const apiGraphqlConfig = params.config?.API?.GraphQL;

  if (isApiGraphQLConfig(apiGraphqlConfig)) {
    (client as any).models = generateModelsPropertyServer<T>(
      client as any,
      params,
      getInternals,
    );
    (client as any).enums = generateEnumsProperty<T>(apiGraphqlConfig);
    (client as any).queries = generateCustomQueriesProperty<T>(
      client as any,
      apiGraphqlConfig,
      getInternals,
    );
    (client as any).mutations = generateCustomMutationsProperty<T>(
      client as any,
      apiGraphqlConfig,
      getInternals,
    );
  }

  return client as any;
}

export function addSchemaToClient<T extends Record<any, any> = never>(
  client: BaseClient,
  apiGraphqlConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): BaseClient & ClientExtensions<T> {
  (client as any).models = generateModelsProperty<T>(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  (client as any).enums = generateEnumsProperty<T>(apiGraphqlConfig);
  (client as any).queries = generateCustomQueriesProperty<T>(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  (client as any).mutations = generateCustomMutationsProperty<T>(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  (client as any).subscriptions = generateCustomSubscriptionsProperty(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  return client as any;
}
