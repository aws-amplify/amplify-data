import { a, ClientSchema } from '@aws-amplify/data-schema';
import { ModelTypes } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { buildConfig } from '../../utils/build-amplify-config';

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
    return await value;
  });
}

describe('getting started guides', () => {
  describe('Todo schema', () => {
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

    test('produces correct graphql', async () => {
      const transformed = schema.transform();
      expect(transformed.schema).toMatchSnapshot();
    });

    test('produces correct model intro schema', async () => {
      const config = await buildConfig(schema);
      expect(config).toMatchSnapshot();
    });

    test('can create', async () => {
      const config = await buildConfig(schema);
      Amplify.configure(config);

      const client = await generateClient<Schema>();
      const spy = mockApiResponse(client, {
        data: {
          createTodo: {
            __typename: 'Todo',
            ...serverManagedFields,
            name: 'some name',
            description: 'something something',
          },
        },
      });

      const result = await client.models.Todo.create({
        content: 'basic content',
      });

      expect(spy.mock.calls).toMatchSnapshot();
      expect(result).toMatchSnapshot();
    });
  });
});
