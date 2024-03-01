import { a, ClientSchema } from '@aws-amplify/data-schema';
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

/**
 * @param value Value to be returned. Will be `awaited`, and can
 * therefore be a simple JSON value or a `Promise`.
 * @returns
 */
function mockApiResponse(client: any, value: any) {
  return jest.spyOn(client, 'graphql').mockImplementation(async () => {
    console.log('mocked impl');
    const result = await value;
    return {
      body: {
        json: () => result,
      },
    };
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
            something: 'else',
          },
        },
      });

      const { data } = await client.models.Todo.create({
        content: 'basic content',
      });

      expect(spy.mock.calls).toMatchSnapshot();
      expect(data).toMatchSnapshot();
    });
  });
});
