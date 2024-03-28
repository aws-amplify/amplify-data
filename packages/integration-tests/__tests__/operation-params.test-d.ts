import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal, __modelMeta__ } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

type Json = null | string | number | boolean | object | any[];

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
      body: a.string(),
    }),
  });

  type Schema = ClientSchema<typeof schema>;

  type M = Schema[typeof __modelMeta__];

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

      test('lazy loaded hasMany returns a non-nullable list of non-nullable elements', async () => {
        const { data } = await client.models.Post.get({ id: 'something' });
        const comments = await data.comments();
        type Comments = (typeof comments)['data'];

        type testA = Expect<Equal<NonNullable<Comments>, Comments>>;
        type testB = Expect<
          Equal<NonNullable<Comments[number]>, Comments[number]>
        >;
      });
    });
    describe('create', () => {
      const createSchema = a.schema({
        ImplicitId: a.model({
          content: a.string(),
          metadata: a.json(),
        }),
        RequiredId: a.model({
          id: a.id().required(),
          content: a.string(),
          metadata: a.json(),
        }),
        CustomPk: a
          .model({
            custom: a.string().required(),
            content: a.string(),
            metadata: a.json(),
          })
          .identifier(['custom']),
      });
      type CreateSchema = ClientSchema<typeof createSchema>;

      const createClient = generateClient<CreateSchema>();

      test('id is optional when omitted', () => {
        type CreateParamsActual = Parameters<
          typeof createClient.models.ImplicitId.create
        >[0];
        type CreateParamsExpected = {
          id?: string | undefined;
          content?: string | null | undefined;
          metadata?: Json | undefined;
        };
        type test = Expect<Equal<CreateParamsExpected, CreateParamsActual>>;
      });

      test('id is optional when required', () => {
        type CreateParamsActual = Parameters<
          typeof createClient.models.RequiredId.create
        >[0];
        type CreateParamsExpected = {
          id?: string | undefined;
          content?: string | null | undefined;
          metadata?: Json | undefined;
        };
        type test = Expect<Equal<CreateParamsExpected, CreateParamsActual>>;
      });

      test('custom pk is required when custom pk is defined and required', () => {
        type CreateParamsActual = Parameters<
          typeof createClient.models.CustomPk.create
        >[0];
        type CreateParamsExpected = {
          custom: string;
          content?: string | null | undefined;
          metadata?: Json | undefined;
        };
        type test = Expect<Equal<CreateParamsExpected, CreateParamsActual>>;
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
        await data!.comments({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded hasOne`, async () => {
        // expect no type errors
        const { data } = await client.models.Post.get({ id: 'something' });
        await data!.meta({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded belongsTo`, async () => {
        // expect no type errors
        const { data } = await client.models.Comment.get({ id: 'something' });
        await data!.post({ authMode });
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
      await data!.comments({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on hasOne', async () => {
      // expect no type errors
      const { data } = await client.models.Post.get({ id: 'something' });
      await data!.meta({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on belongsTo', async () => {
      // expect no type errors
      const { data } = await client.models.Comment.get({ id: 'something' });
      await data!.post({ authMode: 'lambda', authToken: 'any string' });
    });
  });

  describe('can filter on', () => {
    test('basic fields', async () => {
      await client.models.Post.list({
        filter: {
          title: { eq: 'whatever ' },
        },
      });
    });

    test('implicit ID', async () => {
      await client.models.Post.list({
        filter: {
          id: { eq: 'whatever ' },
        },
      });
    });

    test('implicit createdAt', async () => {
      await client.models.Post.list({
        filter: {
          createdAt: { eq: 'whatever ' },
        },
      });
    });

    test('implicit updatedAt', async () => {
      await client.models.Post.list({
        filter: {
          updatedAt: { eq: 'whatever ' },
        },
      });
    });

    test('implicit FK', async () => {
      await client.models.Comment.list({
        filter: {
          postCommentsId: { eq: 'whatever' },
        },
      });
    });
  });

  describe('can not filter on', () => {
    test('non-existent fields', async () => {
      await client.models.Post.list({
        filter: {
          // @ts-expect-error
          badField: { eq: 'something naughty' },
        },
      });
    });
  });
});

describe('operation params for many-to-many implicit models', () => {
  const schema = a.schema({
    Post: a.model({
      title: a.string().required(),
      postTags: a.manyToMany('Tag', { relationName: 'PostTag' }),
    }),
    Tag: a.model({
      label: a.string().required(),
      postTags: a.manyToMany('Post', { relationName: 'PostTag' }),
    }),
  });

  type Schema = ClientSchema<typeof schema>;
  const client = generateClient<Schema>();

  test('create operation has correct id parameter types', () => {
    type Resolved = Pick<
      Parameters<typeof client.models.PostTag.create>[0],
      'id'
    >;

    type Expected = {
      id?: string;
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('update operation has correct id parameter types', () => {
    type Resolved = Pick<
      Parameters<typeof client.models.PostTag.update>[0],
      'id'
    >;

    type Expected = {
      id: string;
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('delete operation has correct id parameter types', () => {
    type Resolved = Pick<
      Parameters<typeof client.models.PostTag.delete>[0],
      'id'
    >;

    type Expected = {
      id: string;
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('get operation has correct id parameter types', () => {
    const getFunc = client.models.Post.get<
      Record<string, unknown>,
      ReadonlyArray<any>
    >;
    type Resolved = Parameters<typeof getFunc>[0];

    type Expected = {
      id: string;
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });
});
