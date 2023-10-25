import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';
import {
  Expect,
  Equal,
  SelectionSet,
} from '@aws-amplify/amplify-api-next-types-alpha';
import { API } from 'aws-amplify';

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

  describe('authMode at the call site', () => {
    for (const authMode of authModes) {
      test(`can specify ${authMode} for list()`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        await client.models.Post.list({
          authMode,
        });
      });

      test(`can specify ${authMode} for list()`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        await client.models.Post.get(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} for update()`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        await client.models.Post.update(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} for delete()`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        await client.models.Post.delete(
          { id: 'something' },
          {
            authMode,
          },
        );
      });

      test(`can specify ${authMode} on lazy loaded hasMany`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        const { data } = await client.models.Post.get({ id: 'something' });
        await data.comments({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded hasOne`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        const { data } = await client.models.Post.get({ id: 'something' });
        await data.meta({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded belongsTo`, async () => {
        const client = API.generateClient<Schema>();

        // expect no type errors
        const { data } = await client.models.Comment.get({ id: 'something' });
        await data.post({ authMode });
      });
    }

    test('cannot specify unknown auth mode', async () => {
      const client = API.generateClient<Schema>();

      await client.models.Post.list({
        // I mean, we should definitly support this, but we don't: https://noauth.lol/
        // @ts-expect-error
        authMode: 'noauth.lol',
      });
    });

    test('can specify authToken', async () => {
      const client = API.generateClient<Schema>();

      // expect no type errors
      await client.models.Post.list({
        authMode: 'lambda',
        authToken: 'any string',
      });
    });

    test('can specify authToken on hasMany', async () => {
      const client = API.generateClient<Schema>();

      // expect no type errors
      const { data } = await client.models.Post.get({ id: 'something' });
      await data.comments({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on hasOne', async () => {
      const client = API.generateClient<Schema>();

      // expect no type errors
      const { data } = await client.models.Post.get({ id: 'something' });
      await data.meta({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on belongsTo', async () => {
      const client = API.generateClient<Schema>();

      // expect no type errors
      const { data } = await client.models.Comment.get({ id: 'something' });
      await data.post({ authMode: 'lambda', authToken: 'any string' });
    });
  });
});
