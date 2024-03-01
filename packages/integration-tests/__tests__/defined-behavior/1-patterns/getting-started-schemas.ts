import { a, ClientSchema } from '@aws-amplify/data-schema';
// import {
//   type Expect,
//   type Equal,
//   type CustomQueries,
//   type CustomMutations,
//   type ModelTypes,
//   type GraphQLFormattedError,
//   __modelMeta__,
// } from '@aws-amplify/data-schema-types';

describe('getting started guides', () => {
  describe('nextjs app router server components', () => {
    test('add data Todo schema', async () => {
      const schema = a.schema({
        Todo: a
          .model({
            content: a.string(),
            done: a.boolean(),
            priority: a.enum(['low', 'medium', 'high']),
          })
          .authorization([a.allow.owner(), a.allow.public().to(['read'])]),
      });
      expect(schema.transform()).toMatchSnapshot();
    });
  });
});
