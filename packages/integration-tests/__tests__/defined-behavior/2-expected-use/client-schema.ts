import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('ClientSchema', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`['ModelName']`, () => {
    describe(`['type']`, () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string().required(),
            body: a.string().required(),
            tags: a.string().array(),
            comments: a.hasMany('Comment', 'postId'),
          }),
          Comment: a.model({
            author: a.string().required(),
            body: a.string().required(),
            postId: a.id(),
            post: a.belongsTo('Post', 'postId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);
      type Schema = ClientSchema<typeof schema>;

      beforeEach(async () => {
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
      });

      // /**
      //  * Just used to create a client with the correct type signature that will
      //  * not throw an error upon invocation. Not for checking runtime behavior.
      //  */
      // async function getMockClient() {
      //   const { generateClient } = mockedGenerateClient([{ data: null }]);
      //   const config = await buildAmplifyConfig(schema);
      //   Amplify.configure(config);
      //   const client = generateClient<Schema>();
      //   return client;
      // }

      test(`matches 'get()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([{ data: null }]);
        const client = generateClient<Schema>();

        // The `Post` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `get`()`
        type Post = Schema['Post']['type'];
        const result = await client.models.Post.get({ id: 'abc' });
        const _post: Post = result.data!;
      });

      test(`matches 'update()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([{ data: null }]);
        const client = generateClient<Schema>();

        // The `Post` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from an `update`()`
        type Post = Schema['Post']['type'];
        const result = await client.models.Post.update({ id: 'abc' });
        const _post: Post = result.data!;
      });

      test(`matches 'delete()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([{ data: null }]);
        const client = generateClient<Schema>();

        // The `Post` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `delete`()`
        type Post = Schema['Post']['type'];
        const result = await client.models.Post.delete({ id: 'abc' });
        const _post: Post = result.data!;
      });

      test(`matches 'list()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { listPosts: [] } },
        ]);
        const client = generateClient<Schema>();

        // The `Post` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `list`()`
        type Post = Schema['Post']['type'];
        const result = await client.models.Post.list();
        const _post: Post[] = result.data!;
      });
    });
  });
});
