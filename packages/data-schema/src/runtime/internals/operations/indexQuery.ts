// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AmplifyServer,
  AuthModeParams,
  BaseClient,
  ClientInternalsGetter,
  GraphQLResult,
  ListArgs,
  ModelIntrospectionSchema,
  SchemaModel,
  QueryArgs,
} from '../../bridge-types';

import {
  authModeParams,
  buildGraphQLVariables,
  flattenItems,
  generateGraphQLDocument,
  getCustomHeaders,
  initializeModel,
} from '../APIClient';

import { handleListGraphQlError } from './utils';
import { selfAwareAsync } from '../../utils';
import { extendCancellability } from '../cancellation';

export interface IndexMeta {
  queryField: string;
  pk: string;
  sk?: string[];
}

export function indexQueryFactory(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  indexMeta: IndexMeta,
  getInternals: ClientInternalsGetter,
  context = false,
) {
  const indexQueryWithContext = (
    contextSpec: AmplifyServer.ContextSpec,
    args: QueryArgs,
    options?: ListArgs,
  ) => {
    return _indexQuery(
      client,
      modelIntrospection,
      model,
      indexMeta,
      getInternals,
      {
        ...args,
        ...options,
      },
      contextSpec,
    );
  };

  const indexQuery = (args: QueryArgs, options?: ListArgs) => {
    return _indexQuery(
      client,
      modelIntrospection,
      model,
      indexMeta,
      getInternals,
      {
        ...args,
        ...options,
      },
    );
  };

  return context ? indexQueryWithContext : indexQuery;
}

function processGraphQlResponse(
  modelIntroSchema: ModelIntrospectionSchema,
  modelName: string,
  result: GraphQLResult,
  selectionSet: undefined | string[],
  modelInitializer: (flattenedResult: any[]) => any[],
) {
  const { data, extensions } = result;

  const [key] = Object.keys(data);

  if (data[key].items) {
    const flattenedResult = data[key].items.map((value: Record<string, any>) =>
      flattenItems(modelIntroSchema, modelName, value),
    );

    return {
      data: selectionSet ? flattenedResult : modelInitializer(flattenedResult),
      nextToken: data[key].nextToken,
      extensions,
    };
  }

  // Index queries are always list queries. No `items`? No flattening needed.
  return {
    data: data[key],
    nextToken: data[key].nextToken,
    extensions,
  };
}

function _indexQuery(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  indexMeta: IndexMeta,
  getInternals: ClientInternalsGetter,
  args?: ListArgs & AuthModeParams,
  contextSpec?: AmplifyServer.ContextSpec,
) {
  return selfAwareAsync(async (resultPromise) => {
    const { name } = model;

    const query = generateGraphQLDocument(
      modelIntrospection,
      model,
      'INDEX_QUERY',
      args,
      indexMeta,
    );
    const variables = buildGraphQLVariables(
      model,
      'INDEX_QUERY',
      args,
      modelIntrospection,
      indexMeta,
    );

    const auth = authModeParams(client, getInternals, args);

    const modelInitializer = (flattenedResult: any[]) =>
      initializeModel(
        client,
        name,
        flattenedResult,
        modelIntrospection,
        auth.authMode,
        auth.authToken,
        !!contextSpec,
      );

    try {
      const headers = getCustomHeaders(client, getInternals, args?.headers);

      const graphQlParams = {
        ...auth,
        query,
        variables,
      };

      const requestArgs: [any, any] = [graphQlParams, headers];

      if (contextSpec !== undefined) {
        requestArgs.unshift(contextSpec);
      }

      const basePromise = (client as BaseClient).graphql(
        ...requestArgs,
      ) as Promise<GraphQLResult>;
      const extendedPromise = extendCancellability(basePromise, resultPromise);
      const response = await extendedPromise;

      if (response.data !== undefined) {
        return processGraphQlResponse(
          modelIntrospection,
          name,
          response,
          args?.selectionSet,
          modelInitializer,
        );
      }
    } catch (error: any) {
      /**
       * The `data` type returned by `error` here could be:
       * 1) `null`
       * 2) an empty object
       * 3) "populated" but with a `null` value:
       *   `data: { listByExampleId: null }`
       * 4) an actual record:
       *   `data: { listByExampleId: items: [{ id: '1', ...etc } }]`
       */
      const { data, errors } = error;

      // `data` is not `null`, and is not an empty object:
      if (
        data !== undefined &&
        data !== null &&
        Object.keys(data).length !== 0 &&
        errors
      ) {
        const [key] = Object.keys(data);

        if (data[key]?.items) {
          const flattenedResult = data[key]?.items.map(
            (value: Record<string, any>) =>
              flattenItems(modelIntrospection, name, value),
          );

          /**
           * Check exists since `flattenedResult` could be `null`.
           * if `flattenedResult` exists, result is an actual record.
           */
          if (flattenedResult) {
            return {
              data: args?.selectionSet
                ? flattenedResult
                : modelInitializer(flattenedResult),
              nextToken: data[key]?.nextToken,
            };
          }
        }

        // response is of type `data: { listByExampleId: null }`
        return {
          data: data[key],
          nextToken: data[key]?.nextToken,
        };
      } else {
        // `data` is `null` or an empty object:
        return handleListGraphQlError(error);
      }
    }
  });
}
