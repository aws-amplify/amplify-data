import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

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
