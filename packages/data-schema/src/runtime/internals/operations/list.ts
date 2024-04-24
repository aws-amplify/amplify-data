// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AmplifyServer,
  AuthModeParams,
  BaseClient,
  BaseBrowserClient,
  BaseSSRClient,
  ClientInternalsGetter,
  GraphQLResult,
  ListArgs,
  ModelIntrospectionSchema,
  SchemaModel,
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

export function listFactory(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  getInternals: ClientInternalsGetter,
  context = false,
) {
  const listWithContext = async (
    contextSpec: AmplifyServer.ContextSpec,
    args?: ListArgs,
  ) => {
    return _list(
      client,
      modelIntrospection,
      model,
      getInternals,
      args,
      contextSpec,
    );
  };

  const list = async (args?: Record<string, any>) => {
    return _list(client, modelIntrospection, model, getInternals, args);
  };

  return context ? listWithContext : list;
}

async function _list(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  getInternals: ClientInternalsGetter,
  args?: ListArgs & AuthModeParams,
  contextSpec?: AmplifyServer.ContextSpec,
) {
  const { name } = model;

  const query = generateGraphQLDocument(modelIntrospection, name, 'LIST', args);
  const variables = buildGraphQLVariables(
    model,
    'LIST',
    args,
    modelIntrospection,
  );

  const auth = authModeParams(client, getInternals, args);

  try {
    const headers = getCustomHeaders(client, getInternals, args?.headers);

    const { data, extensions } = contextSpec
      ? ((await (client as BaseSSRClient).graphql(
          contextSpec,
          {
            ...auth,
            query,
            variables,
          },
          headers,
        )) as GraphQLResult)
      : ((await (client as BaseBrowserClient).graphql(
          {
            ...auth,
            query,
            variables,
          },
          headers,
        )) as GraphQLResult);

    // flatten response
    if (data !== undefined) {
      const [key] = Object.keys(data);

      if (data[key].items) {
        const flattenedResult = flattenItems(data)[key];

        // don't init if custom selection set
        if (args?.selectionSet) {
          return {
            data: flattenedResult,
            nextToken: data[key].nextToken,
            extensions,
          };
        } else {
          const initialized = initializeModel(
            client,
            name,
            flattenedResult,
            modelIntrospection,
            auth.authMode,
            auth.authToken,
            !!contextSpec,
          );

          return {
            data: initialized,
            nextToken: data[key].nextToken,
            extensions,
          };
        }
      }

      return {
        data: data[key],
        nextToken: data[key].nextToken,
        extensions,
      };
    }
  } catch (error: any) {
    /**
     * The `data` type returned by `error` here could be:
     * 1) `null`
     * 2) an empty object
     * 3) "populated" but with a `null` value `data: { listPosts: null }`
     * 4) actual records `data: { listPosts: items: [{ id: '1', ...etc }] }`
     */
    const { data, errors } = error;

    // `data` is not `null`, and is not an empty object:
    if (data !== undefined && Object.keys(data).length !== 0 && errors) {
      const [key] = Object.keys(data);

      if (data[key]?.items) {
        const flattenedResult = flattenItems(data)[key];

        /**
         * Check exists since `flattenedResult` could be `null`.
         * if `flattenedResult` exists, result is an actual record.
         */
        if (flattenedResult) {
          // don't init if custom selection set
          if (args?.selectionSet) {
            return {
              data: flattenedResult,
              nextToken: data[key]?.nextToken,
              errors,
            };
          } else {
            const initialized = initializeModel(
              client,
              name,
              flattenedResult,
              modelIntrospection,
              auth.authMode,
              auth.authToken,
              !!contextSpec,
            );

            // data is full record w/out selection set:
            return {
              data: initialized,
              nextToken: data[key]?.nextToken,
              errors,
            };
          }
        }

        return {
          data: data[key],
          nextToken: data[key]?.nextToken,
          errors,
        };
      } else {
        // response is of type `data: { getPost: null }`)
        return handleListGraphQlError(error);
      }
    } else {
      // `data` is `null` or an empty object:
      return handleListGraphQlError(error);
    }
  }
}
