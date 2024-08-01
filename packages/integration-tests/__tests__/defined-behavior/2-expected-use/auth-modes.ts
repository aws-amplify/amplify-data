import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
} from '../../utils';
import { generateClient as actualGenerateClient } from 'aws-amplify/api';

const schema = a
  .schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      comments: a.hasMany('Comment', 'postId'),
      meta: a.hasOne('Meta', 'postId'),
    }),
    Comment: a.model({
      body: a.string().required(),
      postId: a.id(),
      post: a.belongsTo('Post', 'postId'),
    }),
    Meta: a.model({
      body: a.string(),
      postId: a.id(),
      post: a.belongsTo('Post', 'postId'),
    }),
  })
  .authorization((allow) => [
    allow.publicApiKey(),
    allow.guest(),
    allow.custom(),
    allow.authenticated(),
  ]);

type Schema = ClientSchema<typeof schema>;

// Tests ensure authMode override value is passed through into the GraphQLOptions param
// in GraphQLAPI.graphql
describe('authMode overrides', () => {
  const authModes = [
    'apiKey',
    'identityPool',
    'lambda',
    'oidc',
    'userPool',
  ] as const;

  describe('client', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
    });

    for (const authMode of authModes) {
      describe(authMode, () => {
        test('list()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { listPosts: [] } },
          ]);
          const client = generateClient<Schema>({ authMode: authMode });
          await client.models.Post.list();

          const [call] = spy.mock.calls;
          const [_amplifyInstance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('get()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { getPost: {} } },
          ]);
          const client = generateClient<Schema>({ authMode: authMode });

          await client.models.Post.get({ id: 'abc' });

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('create()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { createPost: {} } },
          ]);
          const client = generateClient<Schema>({ authMode: authMode });

          await client.models.Post.create({ title: 'abc' });

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('update()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { updatePost: {} } },
          ]);
          const client = generateClient<Schema>({ authMode: authMode });

          await client.models.Post.update({ id: 'abc' });

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('delete()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { deletePost: {} } },
          ]);
          const client = generateClient<Schema>({ authMode: authMode });

          await client.models.Post.delete({ id: 'abc' });

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });
      });
    }
  });

  describe('call site', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
    });

    for (const authMode of authModes) {
      describe(authMode, () => {
        test('list()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { listPosts: [] } },
          ]);
          const client = generateClient<Schema>();

          await client.models.Post.list({ authMode: authMode });

          const [call] = spy.mock.calls;
          const [_amplifyInstance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('get()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { getPost: {} } },
          ]);
          const client = generateClient<Schema>();

          await client.models.Post.get({ id: 'abc' }, { authMode: authMode });

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('create()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { createPost: {} } },
          ]);
          const client = generateClient<Schema>();

          await client.models.Post.create(
            { title: 'abc' },
            { authMode: authMode },
          );

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('update()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { updatePost: {} } },
          ]);
          const client = generateClient<Schema>();

          await client.models.Post.update(
            { id: 'abc' },
            { authMode: authMode },
          );

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });

        test('delete()', async () => {
          const { spy, generateClient } = mockedGenerateClient([
            { data: { deletePost: {} } },
          ]);
          const client = generateClient<Schema>();

          await client.models.Post.delete(
            { id: 'abc' },
            { authMode: authMode },
          );

          const [call] = spy.mock.calls;
          const [_instance, options] = call;

          expect(options).toEqual(
            expect.objectContaining({
              authMode: authMode,
            }),
          );
        });
      });
    }
  });
});

/*
 * Note: keeping the more exhaustive tests for this functionality in the JS repo for now because behavior
 * depends on implementation that is deeply nested in the class hierarchy and would be difficult to mock reliably from this repo
 */
describe('custom client and request headers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // same code path for all CRUD operations; just testing Get
  describe('CRUD', () => {
    let generateClient: typeof actualGenerateClient;
    let innerSpy: jest.SpyInstance;

    beforeEach(async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);

      const mocks = mockedGenerateClient([
        {
          // data doesn't matter; we're just validating that headers are passed through
          data: { op: {} },
        },
      ]);

      generateClient = mocks.generateClient as typeof actualGenerateClient;
      innerSpy = mocks.innerSpy;
    });

    test('client headers', async () => {
      const client = generateClient<Schema>({
        headers: {
          'client-header': 'should exist',
        },
      });

      await client.models.Post.get({ id: 'a1' });

      const [[, headers]] = optionsAndHeaders(innerSpy);

      expect(headers).toStrictEqual({ 'client-header': 'should exist' });
    });

    test('client header function', async () => {
      const client = generateClient<Schema>({
        headers: async () => ({
          'client-header': 'should exist',
        }),
      });

      await client.models.Post.get({ id: 'a1' });

      const [[, headers]] = optionsAndHeaders(innerSpy);

      const resolvedHeaders = await headers();

      expect(resolvedHeaders).toStrictEqual({
        'client-header': 'should exist',
      });
    });
  });
});
