// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CustomMutations, CustomQueries, CustomSubscriptions } from '../client';
import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
} from '../bridge-types';

import { customOpFactory } from './operations/custom';

type OpTypes = 'queries' | 'mutations' | 'subscriptions';

type CustomOpsProperty<
  T extends Record<any, any>,
  OpType extends OpTypes,
> = OpType extends 'queries'
  ? CustomQueries<T>
  : OpType extends 'mutations'
    ? CustomMutations<T>
    : OpType extends 'subscriptions'
      ? CustomSubscriptions<T>
      : never;

const operationTypeMap = {
  queries: 'query',
  mutations: 'mutation',
  subscriptions: 'subscription',
} as const;

export function generateCustomOperationsProperty<
  T extends Record<any, any>,
  OpType extends OpTypes,
>(
  client: BaseClient,
  config: GraphQLProviderConfig['GraphQL'],
  operationsType: OpType,
  getInternals: ClientInternalsGetter,
): OpType extends 'queries' ? CustomQueries<T> : CustomMutations<T> {
  // some bundlers end up with `Amplify.configure` being called *after* generate client.
  // if that occurs, we need to *not error* while we wait. handling for late configuration
  // occurs in `generateClient()`. we do not need to subscribe to Hub events here.
  if (!config) {
    return {} as CustomOpsProperty<T, OpType>;
  }

  const modelIntrospection: ModelIntrospectionSchema | undefined =
    config.modelIntrospection;

  // model intro schema might be absent if there's not actually a configured GraphQL API
  if (!modelIntrospection) {
    return {} as CustomOpsProperty<T, OpType>;
  }

  // custom operations will be absent from model intro schema if no custom ops
  // are present on the source schema.
  const operations = modelIntrospection[operationsType];
  if (!operations) {
    return {} as CustomOpsProperty<T, OpType>;
  }

  const ops = {} as CustomOpsProperty<T, OpType>;
  const useContext = getInternals(client).amplify === null;
  for (const operation of Object.values(operations)) {
    (ops as any)[operation.name] = customOpFactory(
      client,
      modelIntrospection,
      operationTypeMap[operationsType],
      operation,
      useContext,
      getInternals,
    );
  }

  return ops;
}

export function generateCustomMutationsProperty<T extends Record<any, any>>(
  client: BaseClient,
  config: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
) {
  return generateCustomOperationsProperty<T, 'mutations'>(
    client,
    config,
    'mutations',
    getInternals,
  );
}

export function generateCustomQueriesProperty<T extends Record<any, any>>(
  client: BaseClient,
  config: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
) {
  return generateCustomOperationsProperty<T, 'queries'>(
    client,
    config,
    'queries',
    getInternals,
  );
}

export function generateCustomSubscriptionsProperty<T extends Record<any, any>>(
  client: BaseClient,
  config: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
) {
  return generateCustomOperationsProperty<T, 'subscriptions'>(
    client,
    config,
    'subscriptions',
    getInternals,
  );
}
