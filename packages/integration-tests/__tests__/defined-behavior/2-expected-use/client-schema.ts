import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('ClientSchema', () => {
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
      LikePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('Post'))
        .authorization((allow) => [allow.publicApiKey()])
        .handler(a.handler.function('')),
    })
    .authorization((allow) => [allow.publicApiKey()]);
  type Schema = ClientSchema<typeof schema>;

  const POST_FIXTURE = {
    id: 'some-id',
    title: 'title',
    body: 'some body',
    tags: [],
  };

  beforeEach(async () => {
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`['ModelName']`, () => {
    describe(`['type']`, () => {
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

      test(`can be assigned to from a matching custom op`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        // #region covers cb7710cc0dc02bd3
        const { data: post } = await client.mutations.LikePost({
          postId: 'something',
        });
        // #endregion

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['type'] = post!;
      });
    });

    describe(`['createType']`, () => {
      test(`can be used for model.create() input`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const post: Schema['Post']['createType'] = {
          title: 'something',
          body: 'something',
        };

        // expect no type error
        await client.models.Post.create(post);
      });

      test(`cannot be instantiated without required fields`, async () => {
        // @ts-expect-error
        const testWithoutTitle: Schema['Post']['createType'] = {
          body: 'something',
        };

        // @ts-expect-error
        const testWithoutBody: Schema['Post']['createType'] = {
          title: 'something',
        };

        // @ts-expect-error
        const testWithoutAnyFields: Schema['Post']['createType'] = {};
      });

      test(`can be assigned to from [type]`, async () => {
        const post = {} as Schema['Post']['type'];

        // expect no type errors
        const test: Schema['Post']['createType'] = post;
      });

      test(`can be assigned to from model method return type (get)`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.models.Post.get({
          id: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['createType'] = post!;
      });

      test(`can be assigned to from a matching custom op`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.mutations.LikePost({
          postId: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['createType'] = post!;
      });

      test('return type from model method can be used for create', async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: {
              getPost: {
                id: 'some-id',
                title: 'title',
                body: 'some body',
                tags: [],
              },
            },
          },
          { data: { createPost: null } },
        ]);
        const client = generateClient<Schema>();

        const { data: retrievedPost } = await client.models.Post.get({
          id: 'something',
        });

        const { data: test } = await client.models.Post.create(retrievedPost!);
      });
    });

    describe(`['updateType']`, () => {
      test(`can be used for model.update() input`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { updatePost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        // minimal requirement for update is just the PK
        const post: Schema['Post']['updateType'] = {
          id: 'something',
        };

        // expect no type error
        await client.models.Post.update(post);
      });

      test(`cannot be instantiated without required fields`, async () => {
        // @ts-expect-error
        const testWithoutPK: Schema['Post']['updateType'] = {
          title: 'something',
          body: 'something',
        };

        // @ts-expect-error
        const testWithoutAnyFields: Schema['Post']['updateType'] = {};
      });

      test(`can be assigned to from [type]`, async () => {
        const post = {} as Schema['Post']['type'];

        // expect no type errors
        const test: Schema['Post']['createType'] = post;
      });

      test(`can be assigned to from model method return type (get)`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { updatePost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.models.Post.get({
          id: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['updateType'] = post!;
      });

      test(`can be assigned to from a matching custom op`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.mutations.LikePost({
          postId: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['updateType'] = post!;
      });

      test('return type from model method can be used for update', async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: {
              getPost: POST_FIXTURE,
            },
          },
          { data: { udpatePost: null } },
        ]);
        const client = generateClient<Schema>();

        const { data: retrievedPost } = await client.models.Post.get({
          id: 'something',
        });

        const { data: test } = await client.models.Post.update(retrievedPost!);
      });
    });

    describe(`['deleteType']`, () => {
      test(`can be used for model.update() input`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { updatePost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        // minimal requirement for update is just the PK
        const post: Schema['Post']['deleteType'] = {
          id: 'something',
        };

        // expect no type error
        await client.models.Post.delete(post);
      });

      test(`cannot be instantiated without required fields`, async () => {
        // @ts-expect-error
        const testWithoutAnyFields: Schema['Post']['deleteType'] = {};
      });

      test(`can be assigned to from [type]`, async () => {
        const post = {} as Schema['Post']['type'];

        // expect no type errors
        const test: Schema['Post']['deleteType'] = post;
      });

      test(`can be assigned to from model method return type (get)`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { updatePost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.models.Post.get({
          id: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['deleteType'] = post!;
      });

      test(`can be assigned to from a matching custom op`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createPost: POST_FIXTURE } },
        ]);
        const client = generateClient<Schema>();

        const { data: post } = await client.mutations.LikePost({
          postId: 'something',
        });

        // expect no type errors, assuming non-null result.
        const test: Schema['Post']['deleteType'] = post!;
      });

      test('return type from model method can be used for delete', async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: {
              getPost: POST_FIXTURE,
            },
          },
          { data: { deletePost: null } },
        ]);
        const client = generateClient<Schema>();

        const { data: retrievedPost } = await client.models.Post.get({
          id: 'something',
        });

        const { data: test } = await client.models.Post.delete(retrievedPost!);
      });
    });
  });

  describe(`[CustomOperationName]`, () => {
    // ['returnType'] and ['functionHandler'] are demonstrated in `1-patterns/client-schema.ts`

    describe(`['args']`, () => {
      test('describes the object type required to call the operation', async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: {
              likePost: POST_FIXTURE,
            },
          },
        ]);
        const client = generateClient<Schema>();

        const likePostArgs: Schema['LikePost']['args'] = { postId: 'some-id' };

        // expect no type errors
        await client.mutations.LikePost(likePostArgs);
      });
    });

    describe(`['type']`, () => {
      test('describes the type actually returned by the operation', async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: {
              likePost: POST_FIXTURE,
            },
          },
        ]);
        const client = generateClient<Schema>();

        const { data } = await client.mutations.LikePost({ postId: 'some-id' });

        // expect no type errors.
        const test: Schema['LikePost']['type'] = data!;
      });
    });
  });
});
