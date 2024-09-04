// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ClientExtensions } from './client';
import {
  generateConversationsProperty,
  generateCustomQueriesProperty,
  generateCustomMutationsProperty,
  generateCustomSubscriptionsProperty,
  generateEnumsProperty,
  generateGenerationsProperty,
  generateModelsProperty,
  upgradeClientCancellation,
} from './internals';
import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
} from './bridge-types';

export function addSchemaToClient<T extends Record<any, any> = never>(
  client: BaseClient,
  apiGraphqlConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): BaseClient & ClientExtensions<T> {
  upgradeClientCancellation(client);
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
  (client as any).conversations = generateConversationsProperty(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  (client as any).generations = generateGenerationsProperty(
    client as any,
    apiGraphqlConfig,
    getInternals,
  );
  return client as any;
}
