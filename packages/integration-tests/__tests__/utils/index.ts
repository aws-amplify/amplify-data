import { generateModels } from '@aws-amplify/graphql-generator';
import { generateClient as actualGenerateClient } from 'aws-amplify/api';
import { GraphQLAPI } from '@aws-amplify/api-graphql'; // eslint-disable-line

const graphqlspy = jest.spyOn(GraphQLAPI as any, 'graphql');
const _graphqlspy = jest.spyOn(GraphQLAPI as any, '_graphql');

// jest.mock('@aws-amplify/api-graphql', () => {
//   const apiGraphql = jest.requireActual('@aws-amplify/api-graphql/internals');
//   console.log({ apiGraphql });
//   // const gql = apiGraphql.InternalGraphQLAPI._graphql;
//   // apiGraphql.InternalGraphQLAPI._originalGraphql = gql;
//   // apiGraphql.InternalGraphQLAPI._graphql = (...args: any) => {
//   //   console.log('InternalGraphQLAPI._graphql proxy');
//   //   return apiGraphql.InternalGraphQLAPI._originalGraphql(...args);
//   // };
//   return apiGraphql;
// });

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
  function generateClient<T extends Record<any, any>>() {
    const client = actualGenerateClient<T>();
    _graphqlspy.mockImplementation(async () => {
      const result = responses.shift();
      if (typeof result === 'function') {
        return result();
      } else {
        return result;
      }
    });
    return client;
  }

  return {
    spy: graphqlspy,
    innerSpy: _graphqlspy,
    generateClient,
  };
}

/**
 * Returns calls to a `.graphql` spy minus the Amplify context object.
 *
 * @param spy `spy` returned from `mockGeneratedClient`
 * @returns
 */
export function optionsAndHeaders(spy: jest.SpyInstance) {
  return spy.mock.calls.map((call: any) => {
    const [amplify, options, additionalHeaders] = call;
    return [options, additionalHeaders];
  });
}
