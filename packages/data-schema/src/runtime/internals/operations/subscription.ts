// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { map } from 'rxjs';
import {
  BaseBrowserClient,
  ClientInternalsGetter,
  GraphqlSubscriptionResult,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';

import {
  ModelOperation,
  authModeParams,
  buildGraphQLVariables,
  generateGraphQLDocument,
  getCustomHeaders,
  initializeModel,
} from '../APIClient';

export function subscriptionFactory(
  client: BaseBrowserClient,
  modelIntrospection: ModelIntrospectionSchema,
  model: SchemaModel,
  operation: ModelOperation,
  getInternals: ClientInternalsGetter,
) {
  const { name } = model as any;

  const subscription = (args?: Record<string, any>) => {
    const query = generateGraphQLDocument(
      modelIntrospection,
      name,
      operation,
      args,
    );

    const variables = buildGraphQLVariables(
      model,
      operation,
      args,
      modelIntrospection,
    );

    const auth = authModeParams(client, getInternals, args);

    const headers = getCustomHeaders(client, getInternals, args?.headers);

    const observable = client.graphql(
      {
        ...auth,
        query,
        variables,
      },
      headers,
    ) as GraphqlSubscriptionResult;

    return observable.pipe(
      map((value) => {
        const [key] = Object.keys(value.data);
        // Will need flattening here if/when custom selection set support is added:
        const data = (value.data as any)[key];
        const [initialized] = initializeModel(
          client,
          name,
          [data],
          modelIntrospection,
          auth.authMode,
          auth.authToken,
        );

        return initialized;
      }),
    );
  };

  return subscription;
}
