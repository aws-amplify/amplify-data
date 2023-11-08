import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';
import {
  Expect,
  Equal,
  SelectionSet,
} from '@aws-amplify/amplify-api-next-types-alpha';
import { generateClient } from 'aws-amplify/api';

const authModes = [
  'apiKey',
  'iam',
  'lambda',
  'oidc',
  'userPool',
  'none',
] as const;

describe('Basic operations', () => {
  const schema = a.schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      comments: a.hasMany('Comment'),
      meta: a.hasOne('Meta'),
    }),
    Comment: a.model({
      body: a.string().required(),
      post: a.belongsTo('Post'),
    }),
    Meta: a.model({
      body: a.json(),
    }),
  });

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  describe('basic typed params', () => {
    describe('get', () => {
      test('parameter can contain PK', async () => {
        await client.models.Post.get({ id: 'some-id' });
      });

      test('requires a parameter', async () => {
        // @ts-expect-error
        await client.models.Post.get();
      });

      test('parameter must contain PK', async () => {
        // @ts-expect-error
        await client.models.Post.get({});
      });

      test('parameter must not contain extra fields', async () => {
        // @ts-expect-error
        await client.models.Post.get({ id: 'some-id', title: 'whatever' });
      });
    });

    describe('list', () => {
      test('allows zero params', async () => {
        await client.models.Post.list();
      });

      test('allows filter param', async () => {
        await client.models.Post.list({
          filter: { description: { eq: 'something' } },
        });
      });

      test('allows filter param with logical OR operator', async () => {
        await client.models.Post.list({
          filter: {
            or: [{ description: { eq: 'a' } }, { description: { eq: 'b' } }],
          },
        });
      });

      test('allows filter param with logical AND operator', async () => {
        await client.models.Post.list({
          filter: {
            and: [
              { description: { contains: 'a' } },
              { description: { notContains: 'b' } },
            ],
          },
        });
      });
    });
  });

  describe('authMode at the call site', () => {
    for (const authMode of authModes) {
      test(`can specify ${authMode} for list()`, async () => {
        // expect no type errors
        await client.models.Post.list({
          authMode,
        });
      });

      test(`can specify ${authMode} for list()`, async () => {
        // expect no type errors
        await client.models.Post.get(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} for update()`, async () => {
        // expect no type errors
        await client.models.Post.update(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} for delete()`, async () => {
        // expect no type errors
        await client.models.Post.delete(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} on lazy loaded hasMany`, async () => {
        // expect no type errors
        const { data } = await client.models.Post.get({ id: 'something' });
        await data.comments({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded hasOne`, async () => {
        // expect no type errors
        const { data } = await client.models.Post.get({ id: 'something' });
        await data.meta({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded belongsTo`, async () => {
        // expect no type errors
        const { data } = await client.models.Comment.get({ id: 'something' });
        await data.post({ authMode });
      });
    }

    test('cannot specify unknown auth mode', async () => {
      await client.models.Post.list({
        // I mean, we should definitly support this, but we don't: https://noauth.lol/
        // @ts-expect-error
        authMode: 'noauth.lol',
      });
    });

    test('can specify authToken', async () => {
      // expect no type errors
      await client.models.Post.list({
        authMode: 'lambda',
        authToken: 'any string',
      });
    });

    test('can specify authToken on hasMany', async () => {
      // expect no type errors
      const { data } = await client.models.Post.get({ id: 'something' });
      await data.comments({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on hasOne', async () => {
      // expect no type errors
      const { data } = await client.models.Post.get({ id: 'something' });
      await data.meta({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on belongsTo', async () => {
      // expect no type errors
      const { data } = await client.models.Comment.get({ id: 'something' });
      await data.post({ authMode: 'lambda', authToken: 'any string' });
    });
  });

  // TODO
  // describe('can filter on implied fields', () => {});
});
