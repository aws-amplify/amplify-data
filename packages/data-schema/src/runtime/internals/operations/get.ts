// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AmplifyServer,
  AuthModeParams,
  BaseClient,
  BaseBrowserClient,
  BaseSSRClient,
  ClientInternalsGetter,
  GraphQLOptions,
  GraphQLResult,
  ListArgs,
  ModelIntrospectionSchema,
  SchemaModel,
  QueryArgs,
} from '../../bridge-types';

import {
  ModelOperation,
  authModeParams,
  buildGraphQLVariables,
  flattenItems,
  generateGraphQLDocument,
  getCustomHeaders,
  initializeModel,
} from '../APIClient';

export function getFactory(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  operation: ModelOperation,
  getInternals: ClientInternalsGetter,
  useContext = false,
) {
  const getWithContext = async (
    contextSpec: AmplifyServer.ContextSpec & GraphQLOptions,
    arg?: any,
    options?: any,
  ) => {
    return _get(
      client,
      modelIntrospection,
      model,
      arg,
      options,
      operation,
      getInternals,
      contextSpec,
    );
  };

  const get = async (arg?: any, options?: any) => {
    return _get(
      client,
      modelIntrospection,
      model,
      arg,
      options,
      operation,
      getInternals,
    );
  };

  return useContext ? getWithContext : get;
}

async function _get(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  arg: QueryArgs,
  options: AuthModeParams & ListArgs,
  operation: ModelOperation,
  getInternals: ClientInternalsGetter,
  context?: AmplifyServer.ContextSpec,
) {
  const { name } = model;

  const query = generateGraphQLDocument(
    modelIntrospection,
    name,
    operation,
    options,
  );
  const variables = buildGraphQLVariables(
    model,
    operation,
    arg,
    modelIntrospection,
  );

  try {
    const auth = authModeParams(client, getInternals, options);

    const headers = getCustomHeaders(client, getInternals, options?.headers);

    const { data, extensions } = context
      ? ((await (client as BaseSSRClient).graphql(
          context,
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
    if (data) {
      const [key] = Object.keys(data);
      const flattenedResult = flattenItems(data)[key];

      if (options?.selectionSet) {
        return { data: flattenedResult, extensions };
      } else {
        // TODO: refactor to avoid destructuring here
        const [initialized] = initializeModel(
          client,
          name,
          [flattenedResult],
          modelIntrospection,
          auth.authMode,
          auth.authToken,
          !!context,
        );

        return { data: initialized, extensions };
      }
    } else {
      return { data: null, extensions };
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
