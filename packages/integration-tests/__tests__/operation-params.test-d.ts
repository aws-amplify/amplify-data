import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal, Prettify } from '@aws-amplify/data-schema-types';
import { __modelMeta__ } from '@aws-amplify/data-schema/runtime';
import { generateClient } from 'aws-amplify/api';

type Json = null | string | number | boolean | object | any[];

const authModes = [
  'apiKey',
  'identityPool',
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

      test('lazy loaded hasMany returns a non-nullable list of non-nullable elements', async () => {
        const { data } = await client.models.Post.get({
          id: 'something',
        });

        const comments = await data?.comments();

        if (!comments) {
          throw new Error('Comments should exist');
        }

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
        const { data } = await client.models.Post.get({
          id: 'something',
        });

        await data?.comments({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded hasOne`, async () => {
        // expect no type errors
        const { data } = await client.models.Post.get({
          id: 'something',
        });

        await data?.meta({ authMode });
      });

      test(`can specify ${authMode} on lazy loaded belongsTo`, async () => {
        // expect no type errors
        const { data } = await client.models.Comment.get({
          id: 'something',
        });

        await data?.post({ authMode });
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
      const { data } = await client.models.Post.get({
        id: 'something',
      });

      await data?.comments({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on hasOne', async () => {
      // expect no type errors
      const { data } = await client.models.Post.get({
        id: 'something',
      });

      await data?.meta({ authMode: 'lambda', authToken: 'any string' });
    });

    test('can specify authToken on belongsTo', async () => {
      // expect no type errors
      const { data } = await client.models.Comment.get({
        id: 'something',
      });

      await data?.post({ authMode: 'lambda', authToken: 'any string' });
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

describe('All supported identifier types', () => {
  test('CRUDL id types - PK only', async () => {
    const schema = a.schema({
      StringPk: a
        .model({
          title: a.string().required(),
        })
        .identifier(['title']),
      IntPk: a
        .model({
          number: a.integer().required(),
        })
        .identifier(['number']),
      FloatPk: a
        .model({
          float: a.float().required(),
        })
        .identifier(['float']),
      DatePk: a
        .model({
          createdAt: a.date().required(),
        })
        .identifier(['createdAt']),
      TimePk: a
        .model({
          time: a.time().required(),
        })
        .identifier(['time']),
      DateTimePk: a
        .model({
          dateTime: a.datetime().required(),
        })
        .identifier(['dateTime']),
      TimestampPk: a
        .model({
          ts: a.timestamp().required(),
        })
        .identifier(['ts']),
      EnumPk: a
        .model({
          enum: a.enum(['a', 'b', 'c']),
        })
        .identifier(['enum']),
      BoolPk: a
        .model({
          bool: a.boolean().required(),
        })
        // @ts-expect-error - booleans cannot be used as PKs (not supported in DDB; enforced in the transformer)
        .identifier(['bool']),
    });

    type Schema = ClientSchema<typeof schema>;

    const client = generateClient<Schema>();

    await client.models.StringPk.get({ title: '...' });

    // @ts-expect-error - PK should not be included in List Options unless SK is defined as well
    await client.models.StringPk.list({ title: '...' });

    // @ts-expect-error - sortDirection should not be included in List Options unless SK is defined on the model
    await client.models.StringPk.list({ sortDirection: 'ASC' });

    await client.models.IntPk.get({ number: 0 });

    await client.models.FloatPk.get({ float: 0.1 });

    await client.models.DatePk.get({ createdAt: '1/1/2000' });
    await client.models.TimePk.get({ time: '1:23' });
    await client.models.DateTimePk.get({ dateTime: '1/1/2000T1:23' });
    await client.models.TimestampPk.get({ ts: 1234 });

    await client.models.EnumPk.get({ enum: 'a' });
  });

  test('CRUDL - composite', async () => {
    const schema = a.schema({
      StringSk: a
        .model({
          id: a.string().required(),
          title: a.string().required(),
        })
        .identifier(['id', 'title']),
      IntSk: a
        .model({
          id: a.string().required(),
          number: a.integer().required(),
        })
        .identifier(['id', 'number']),
      EnumSk: a
        .model({
          id: a.string().required(),
          enum: a.enum(['a', 'b', 'c']),
        })
        .identifier(['id', 'enum']),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    await client.models.StringSk.get({ id: '...', title: '...' });

    await client.models.StringSk.list({
      id: '...',
      title: { beginsWith: '...' },
      sortDirection: 'ASC',
    });

    await client.models.IntSk.get({ id: '...', number: 123 });

    await client.models.IntSk.list({
      id: '...',
      number: { gt: 1 },
      sortDirection: 'ASC',
    });

    await client.models.EnumSk.get({ id: '...', enum: 'a' });

    await client.models.EnumSk.list({
      id: '...',
      enum: { beginsWith: 'a' },
      sortDirection: 'ASC',
    });
  });
});
