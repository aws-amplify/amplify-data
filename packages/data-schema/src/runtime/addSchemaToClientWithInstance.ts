// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isApiGraphQLConfig } from './internals/utils/runtimeTypeGuards/isApiGraphQLProviderConfig';
import {
  ClientExtensionsSSRCookies,
  ClientExtensionsSSRRequest,
} from './client';
import {
  generateCustomQueriesProperty,
  generateCustomMutationsProperty,
  generateEnumsProperty,
} from './internals';
import { generateModelsProperty as generateModelsPropertyServer } from './internals/server';
import { BaseClient, ClientInternalsGetter } from './bridge-types';

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
