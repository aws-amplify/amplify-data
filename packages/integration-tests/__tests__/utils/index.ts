import { generateModels } from '@aws-amplify/graphql-generator';
import { generateClient as actualGenerateClient } from 'aws-amplify/api';

/**
 * @param value Value to be returned. Will be `awaited`, and can
 * therefore be a simple JSON value or a `Promise`.
 * @returns
 */
export function mockApiResponse<T>(client: T, value: any) {
  return jest.spyOn(client as any, 'graphql').mockImplementation(async () => {
    return value;
  });
}

export type GraphQLResult = {
  data: null | Record<string, any>;
  errors?: null | Record<string, any>;
};

/**
 * @param schema Return value from `a.schema()`
 * @returns JSON Amplify config with model intro schema and dummy appsync config.
 */
export async function buildAmplifyConfig(schema: {
  transform: () => { schema: string };
}) {
  return {
    aws_project_region: 'us-east-2',
    aws_appsync_graphqlEndpoint: 'https://localhost/graphql',
    aws_appsync_region: 'us-west-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: 'FAKE-KEY',
    modelIntrospection: JSON.parse(
      (
        await generateModels({
          schema: schema.transform().schema,
          target: 'introspection',
          directives: '',
        })
      )['model-introspection.json'] as any,
    ),
  };
}

/**
 * Produces a `generateClient` function and associated spy that is pre-configured
 * to return the given list of responses in order.
 *
 * This helps facilitate a test structure where as much mocking as done ahead of
 * time as possible, so that the test body can show "actual customer code" to the
 * greatest degree possible.
 *
 * @param responses List of GraphQL responses to issue in order
 * @returns
 */
export function mockedGenerateClient(
  responses: (
    | GraphQLResult
    | (() => GraphQLResult)
    | (() => Promise<GraphQLResult>)
  )[],
) {
  const spy = jest.fn().mockImplementation(async () => {
    const result = responses.shift();
    if (typeof result === 'function') {
      return await result();
    } else {
      return result;
    }
  });

  function generateClient<T extends Record<any, any>>() {
    const client = actualGenerateClient<T>();
    jest.spyOn(client as any, 'graphql').mockImplementation(spy);
    return client;
  }

  return {
    spy,
    generateClient,
  };
}
