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

  try {
    const auth = authModeParams(client, getInternals, args);

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
    if (error.errors) {
      // graphql errors pass through
      return error as any;
    } else {
      // non-graphql errors re re-thrown
      throw error;
    }
  }
}
