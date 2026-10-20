import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type EnumType, enumType } from '../src/EnumType';
import { a, type ClientSchema } from '../src/index';
import type { ClientExtensions } from '../src/runtime';

describe('EnumType', () => {
  test('Happy case', () => {
    const accessLevel = enumType(['public', 'protected', 'private']);

    type Expected = EnumType<readonly ['public', 'protected', 'private']>;

    type Result = typeof accessLevel;

    type test = Expect<Equal<Result, Expected>>;
  });

  test('Error on invalid values', () => {
    // @ts-expect-error
    enumType('public', 'protected', 'private'); // must be array

    // @ts-expect-error
    enumType([1, 2, 3]);

    // @ts-expect-error
    enumType([true, false]);

    // @ts-expect-error
    enumType([null, undefined]);
  });

  test('.required()', () => {
    const accessLevel = enumType(['public', 'protected', 'private']).required();

    type Expected = EnumType<readonly ['public', 'protected', 'private'], true>;

    type Result = typeof accessLevel;

    type test = Expect<Equal<Result, Expected>>;

    // a required enum is not assignable to an optional one, and vice versa
    type testNotOptional = Expect<
      Equal<Result extends EnumType<any> ? true : false, false>
    >;
    type testNotRequired = Expect<
      Equal<
        EnumType<readonly ['a']> extends EnumType<any, true> ? true : false,
        false
      >
    >;
  });

  test('required inline enum model fields are non-nullable', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string(),
        status: a.enum(['draft', 'pending', 'published']).required(),
        visibility: a.enum(['public', 'private']),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    type Post = Schema['Post']['type'];

    type testRequired = Expect<
      Equal<Post['status'], 'draft' | 'pending' | 'published'>
    >;
    type testOptional = Expect<
      Equal<Post['visibility'], 'public' | 'private' | null | undefined>
    >;

    type CreateInput = Schema['Post']['createType'];

    type testCreateRequired = Expect<
      Equal<CreateInput['status'], 'draft' | 'pending' | 'published'>
    >;

    // @ts-expect-error `status` is required on create
    const _missing: CreateInput = { title: 'hello' };
    const _valid: CreateInput = { status: 'draft' };
    // @ts-expect-error `null` is not a valid value for a required enum
    const _null: CreateInput = { status: null };

    type UpdateInput = Schema['Post']['updateType'];

    type testUpdateOptional = Expect<
      Equal<
        UpdateInput['status'],
        'draft' | 'pending' | 'published' | undefined
      >
    >;
  });

  test('required inline enum behaves like a required ref to a top-level enum', () => {
    const schema = a.schema({
      Post: a.model({
        inline: a.enum(['draft', 'published']).required(),
        ref: a.ref('Status').required(),
      }),
      Status: a.enum(['draft', 'published']),
    });

    type Schema = ClientSchema<typeof schema>;
    type Post = Schema['Post']['type'];
    type CreateInput = Schema['Post']['createType'];

    type testType = Expect<Equal<Post['inline'], Post['ref']>>;
    type testCreate = Expect<Equal<CreateInput['inline'], CreateInput['ref']>>;
  });

  test('required inline enum custom type fields are non-nullable', () => {
    const schema = a.schema({
      Location: a.customType({
        kind: a.enum(['home', 'work']).required(),
        label: a.enum(['primary', 'secondary']),
      }),
      Post: a.model({
        location: a.ref('Location'),
        meta: a.customType({
          status: a.enum(['draft', 'published']).required(),
        }),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    type Location = Schema['Location']['type'];

    type testKind = Expect<Equal<Location['kind'], 'home' | 'work'>>;
    type testLabel = Expect<
      Equal<Location['label'], 'primary' | 'secondary' | null | undefined>
    >;

    type Meta = NonNullable<Schema['Post']['type']['meta']>;

    type testMeta = Expect<Equal<Meta, { status: 'draft' | 'published' }>>;
  });

  test('required inline enum custom operation arguments are non-nullable', () => {
    const schema = a.schema({
      listPosts: a
        .query()
        .arguments({
          status: a.enum(['draft', 'published']).required(),
          sort: a.enum(['asc', 'desc']),
        })
        .returns(a.string())
        .handler(a.handler.function('myFn'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    type Args = Schema['listPosts']['args'];

    type testArgs = Expect<
      Equal<
        Args,
        { status: 'draft' | 'published'; sort?: 'asc' | 'desc' | null }
      >
    >;
  });

  test('required inline enum can be used in a secondary index', () => {
    const schema = a.schema({
      Post: a
        .model({
          status: a.enum(['draft', 'published']).required(),
        })
        .secondaryIndexes((index) => [index('status')]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type IndexArgs = Parameters<typeof client.models.Post.listPostByStatus>[0];

    type testIndexArgs = Expect<
      Equal<IndexArgs['status'], 'draft' | 'published'>
    >;
  });

  test('required inline enums are extracted to client enums', () => {
    const schema = a.schema({
      Post: a.model({
        status: a.enum(['draft', 'pending', 'published']).required(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type EnumsProp = typeof client.enums;

    type ExpectedEnumsPropShape = {
      PostStatus: {
        values(): ('draft' | 'pending' | 'published')[];
      };
    };

    type test = Expect<Equal<EnumsProp, ExpectedEnumsPropShape>>;
  });

  test('.required() is not allowed on top-level enums', () => {
    a.schema({
      Post: a.model({
        status: a.ref('Status'),
      }),
      // @ts-expect-error
      Status: a.enum(['draft', 'published']).required(),
    });
  });

  test('enums types extracted from models', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.enum(['draft', 'pending', 'published']),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type EnumsProp = typeof client.enums;

    type ExpectedEnumsPropShape = {
      PostStatus: {
        values(): ('draft' | 'pending' | 'published')[];
      };
    };

    type test = Expect<Equal<EnumsProp, ExpectedEnumsPropShape>>;
  });
});
