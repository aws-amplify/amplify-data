import { a, ClientSchema } from '@aws-amplify/data-schema';
import { ModelTypes } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import { generateClient as actualGenerateClient } from 'aws-amplify/api';
import { buildAmplifyConfig } from '../../utils/build-amplify-config';

// import {
//   type Expect,
//   type Equal,
//   type CustomQueries,
//   type CustomMutations,
//   type ModelTypes,
//   type GraphQLFormattedError,
//   __modelMeta__,
// } from '@aws-amplify/data-schema-types';

const serverManagedFields = {
  id: 'some-id',
  owner: 'wirejobviously',
  createdAt: '2024-03-01T18:05:44.536Z',
  updatedAt: '2024-03-01T19:05:44.536Z',
};

/**
 * @param value Value to be returned. Will be `awaited`, and can
 * therefore be a simple JSON value or a `Promise`.
 * @returns
 */
function mockApiResponse<T>(client: T, value: any) {
  return jest.spyOn(client as any, 'graphql').mockImplementation(async () => {
    return value;
  });
}

type GraphQLResult = {
  data: null | Record<string, any>;
  errors?: null | Record<string, any>;
};

function mockedGenerateClient(
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

describe('getting started guides', () => {
  describe('Todo schema', () => {
    test('can create', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createTodo: {
              __typename: 'Todo',
              ...serverManagedFields,
              name: 'some name',
              description: 'something something',
            },
          },
        },
      ]);

      // example code

      // data/resource.ts
      const schema = a.schema({
        Todo: a
          .model({
            content: a.string(),
            done: a.boolean(),
            priority: a.enum(['low', 'medium', 'high']),
          })
          .authorization([a.allow.owner(), a.allow.public().to(['read'])]),
      });
      type Schema = ClientSchema<typeof schema>;

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);

      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const result = await client.models.Todo.create({
        content: 'basic content',
      });

      // assert
      expect(spy.mock.calls).toMatchSnapshot();
      expect(result).toMatchSnapshot();
    });
  });
});
