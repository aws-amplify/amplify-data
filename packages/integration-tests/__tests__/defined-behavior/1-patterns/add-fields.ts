import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectGraphqlMatches,
} from '../../utils';

describe('Specify a custom field type', () => {
  // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/#specify-a-custom-field-type

  // #region test case data
  const samplePost = {
    __typename: 'Post',
    id: 'some-id',
    content: 'some content',
    location: { lat: 1, long: 2 },
    updatedAt: '2024-03-01T19:05:44.536Z',
    createdAt: '2024-03-01T18:05:44.536Z',
  } as const;

  const opInputResultMap = {
    create: {
      input: {
        content: 'hello',
        location: { lat: 3, long: 4 },
      },
      resultKey: 'createPost',
      result: {
        ...samplePost,
        content: 'hello',
        location: { lat: 3, long: 4 },
      },
    },
    update: {
      input: {
        id: samplePost.id,
        location: { lat: 5, long: 6 },
      },
      resultKey: 'updatePost',
      result: {
        ...samplePost,
        location: { lat: 5, long: 6 },
      },
    },
    delete: {
      input: {
        id: samplePost.id,
      },
      resultKey: 'deletePost',
      result: samplePost,
    },
    list: {
      input: undefined,
      resultKey: 'listPosts',
      result: { items: [samplePost] },
    },
    get: {
      input: {
        id: samplePost.id,
      },
      resultKey: 'getPost',
      result: samplePost,
    },
  } as const;
  // #endregion

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inline definition', () => {
    // #region covers 279bf864a21cd97b, 93fbc94ef4f108d8
    const schema = a
      .schema({
        Post: a.model({
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
          content: a.string(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      type ExpectedCustomTypeInput =
        | {
            lat?: number | null;
            long?: number | null;
          }
        | null
        | undefined;

      test('client input types have expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<
            Schema['Post']['createType']['location'],
            ExpectedCustomTypeInput
          >
        >;

        type _ExpectedUpdateInput = Expect<
          Equal<
            Schema['Post']['createType']['location'],
            ExpectedCustomTypeInput
          >
        >;
      });

      test('client return type has expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<Schema['Post']['type']['location'], ExpectedCustomTypeInput>
        >;
      });
    });

    describe('client runtime', () => {
      Object.entries(opInputResultMap).forEach(
        ([op, { input, resultKey, result }]) => {
          test(`${op}`, async () => {
            const { spy, generateClient } = mockedGenerateClient([
              {
                data: { [resultKey]: result },
              },
            ]);
            const config = await buildAmplifyConfig(schema);
            Amplify.configure(config);
            const client = generateClient<Schema>();

            // @ts-ignore - testing runtime behavior; types are not relevant
            const { data, errors } = await client.models.Post[op](input);

            expect(optionsAndHeaders(spy)).toMatchSnapshot();
            expect(errors).toBeUndefined();

            const normalizedResult =
              op === 'list'
                ? (result as (typeof opInputResultMap)['list']['result']).items
                : result;

            expect(data).toEqual(normalizedResult);
          });
        },
      );
    });
  });

  describe('Explicit definition', () => {
    // #region covers b7fd0a0c85d7fa05
    const schema = a
      .schema({
        Location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),

        Post: a.model({
          location: a.ref('Location'),
          content: a.string(),
        }),

        User: a.model({
          lastKnownLocation: a.ref('Location'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      type ExpectedCustomTypeInput =
        | {
            lat?: number | null;
            long?: number | null;
          }
        | null
        | undefined;

      test('client input types have expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<
            Schema['Post']['createType']['location'],
            ExpectedCustomTypeInput
          >
        >;

        type _ExpectedUpdateInput = Expect<
          Equal<
            Schema['Post']['createType']['location'],
            ExpectedCustomTypeInput
          >
        >;
      });

      test('client return type has expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<Schema['Post']['type']['location'], ExpectedCustomTypeInput>
        >;
      });
    });

    describe('client runtime', () => {
      // #region covers 230bf27a1eb5947d
      Object.entries(opInputResultMap).forEach(
        ([op, { input, resultKey, result }]) => {
          test(`${op}`, async () => {
            const { spy, generateClient } = mockedGenerateClient([
              {
                data: { [resultKey]: result },
              },
            ]);
            const config = await buildAmplifyConfig(schema);
            Amplify.configure(config);
            const client = generateClient<Schema>();

            // @ts-ignore - testing runtime behavior; types are not relevant
            const { data, errors } = await client.models.Post[op](input);

            expect(optionsAndHeaders(spy)).toMatchSnapshot();
            expect(errors).toBeUndefined();

            const normalizedResult =
              op === 'list'
                ? (result as (typeof opInputResultMap)['list']['result']).items
                : result;

            expect(data).toEqual(normalizedResult);
          });
        },
      );
      // #endregion
    });
  });
});

describe('Specify an enum field type', () => {
  // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/#specify-an-enum-field-type
  afterEach(() => {
    jest.clearAllMocks();
  });

  // #region test data
  const samplePost = {
    __typename: 'Post',
    id: 'some-id',
    content: 'some content',
    privacySetting: 'PUBLIC',
    updatedAt: '2024-03-01T19:05:44.536Z',
    createdAt: '2024-03-01T18:05:44.536Z',
  } as const;

  const opInputResultMap = {
    create: {
      input: {
        content: 'hello',
        privacySetting: 'PRIVATE',
      },
      resultKey: 'createPost',
      result: {
        ...samplePost,
        content: 'hello',
        privacySetting: 'PRIVATE',
      },
    },
    update: {
      input: {
        id: samplePost.id,
        privacySetting: 'FRIENDS_ONLY',
      },
      resultKey: 'updatePost',
      result: {
        ...samplePost,
        privacySetting: 'FRIENDS_ONLY',
      },
    },
    delete: {
      input: {
        id: samplePost.id,
      },
      resultKey: 'deletePost',
      result: samplePost,
    },
    list: {
      input: undefined,
      resultKey: 'listPosts',
      result: { items: [samplePost] },
    },
    get: {
      input: {
        id: samplePost.id,
      },
      resultKey: 'getPost',
      result: samplePost,
    },
  } as const;
  // #endregion

  describe('Inline definition', () => {
    // #region covers 35bf03594722226f
    const schema = a
      .schema({
        Post: a.model({
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          content: a.string(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      type ExpectedEnumInput =
        | 'PRIVATE'
        | 'FRIENDS_ONLY'
        | 'PUBLIC'
        | null
        | undefined;

      test('client input types have expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<
            Schema['Post']['createType']['privacySetting'],
            ExpectedEnumInput
          >
        >;

        type _ExpectedUpdateInput = Expect<
          Equal<
            Schema['Post']['createType']['privacySetting'],
            ExpectedEnumInput
          >
        >;
      });

      test('client return type has expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<Schema['Post']['type']['privacySetting'], ExpectedEnumInput>
        >;
      });
    });

    describe('client runtime', () => {
      test('list enum values', async () => {
        const { generateClient } = mockedGenerateClient([]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();

        const enumValues = client.enums.PostPrivacySetting.values();
        expect(enumValues).toStrictEqual(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']);
      });

      Object.entries(opInputResultMap).forEach(
        ([op, { input, resultKey, result }]) => {
          test(`${op}`, async () => {
            const { spy, generateClient } = mockedGenerateClient([
              {
                data: { [resultKey]: result },
              },
            ]);
            const config = await buildAmplifyConfig(schema);
            Amplify.configure(config);
            const client = generateClient<Schema>();

            // @ts-ignore - testing runtime behavior; types are not relevant
            const { data, errors } = await client.models.Post[op](input);

            expect(optionsAndHeaders(spy)).toMatchSnapshot();
            expect(errors).toBeUndefined();

            const normalizedResult =
              op === 'list'
                ? (result as (typeof opInputResultMap)['list']['result']).items
                : result;

            expect(data).toEqual(normalizedResult);
          });
        },
      );

      test('enums types are enforced on the client', async () => {
        const { generateClient } = mockedGenerateClient([]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();

        // #region covers 53b6683a37d9bc50
        try {
          await client.models.Post.create({
            content: 'hello',
            // WORKS - value auto-completed
            privacySetting: 'PRIVATE',
          });

          await client.models.Post.create({
            content: 'hello',
            // DOES NOT WORK - TYPE ERROR
            // @ts-expect-error
            privacySetting: 'NOT_PUBLIC',
          });
        } catch {
          // runtime not under test
        }
        // #endregion
      });
    });
  });

  describe('Explicit definition', () => {
    // #region covers f88634036e3d5189
    const schema = a
      .schema({
        PrivacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),

        Post: a.model({
          privacySetting: a.ref('PrivacySetting'),
          content: a.string(),
        }),

        Video: a.model({
          privacySetting: a.ref('PrivacySetting'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      type ExpectedEnumInput =
        | 'PRIVATE'
        | 'FRIENDS_ONLY'
        | 'PUBLIC'
        | null
        | undefined;

      test('client input types have expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<
            Schema['Post']['createType']['privacySetting'],
            ExpectedEnumInput
          >
        >;

        type _ExpectedUpdateInput = Expect<
          Equal<
            Schema['Post']['createType']['privacySetting'],
            ExpectedEnumInput
          >
        >;
      });

      test('client return type has expected shape', () => {
        type _ExpectedCreateInput = Expect<
          Equal<Schema['Post']['type']['privacySetting'], ExpectedEnumInput>
        >;
      });
    });

    describe('client runtime', () => {
      test('list enum values', async () => {
        const { generateClient } = mockedGenerateClient([]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();

        // #region covers 1f73a4fff6b93118
        const enumValues = client.enums.PrivacySetting.values();
        expect(enumValues).toStrictEqual(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']);
        // #endregion
      });

      Object.entries(opInputResultMap).forEach(
        ([op, { input, resultKey, result }]) => {
          test(`${op}`, async () => {
            const { spy, generateClient } = mockedGenerateClient([
              {
                data: { [resultKey]: result },
              },
            ]);
            const config = await buildAmplifyConfig(schema);
            Amplify.configure(config);
            const client = generateClient<Schema>();

            // @ts-ignore - testing runtime behavior; types are not relevant
            const { data, errors } = await client.models.Post[op](input);

            expect(optionsAndHeaders(spy)).toMatchSnapshot();
            expect(errors).toBeUndefined();

            const normalizedResult =
              op === 'list'
                ? (result as (typeof opInputResultMap)['list']['result']).items
                : result;

            expect(data).toEqual(normalizedResult);
          });
        },
      );
    });
  });

  describe('Mark field as required', () => {
    // #region covers 0d26c55b7f416673
    const schema = a
      .schema({
        Todo: a.model({
          content: a.string().required(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test('Required field is non-nullable', () => {
      type _test = Expect<Equal<Schema['Todo']['type']['content'], string>>;
    });

    test('Required field must be provided during create', async () => {
      const { generateClient } = mockedGenerateClient([]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      // @ts-expect-error
      await expect(client.models.Todo.create({})).rejects.toThrow();
    });
  });

  describe('Mark field as array', () => {
    // #region covers 2b588d62751dc8ee
    const schema = a
      .schema({
        Todo: a.model({
          content: a.string().required(),
          todos: a.string().array(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test('Array field is an array type', () => {
      type _test = Expect<
        Equal<
          Schema['Todo']['type']['todos'],
          (string | null)[] | null | undefined
        >
      >;
    });

    test('Accepts arrays during create', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            createTodo: {
              id: 'some-id',
              content: 'some-content',
              todos: ['a', 'b', 'c'],
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data } = await client.models.Todo.create({
        content: 'some-content',
        todos: ['a', 'b', 'c'],
      });

      expect(data).toEqual(
        expect.objectContaining({
          content: 'some-content',
          todos: ['a', 'b', 'c'],
        }),
      );
    });
  });

  describe('Mark field as array', () => {
    // #region covers 74405b7e731fd3fd
    const schema = a
      .schema({
        Todo: a.model({
          content: a.string().default('My new Todo'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test('Array field is an array type', () => {
      type _test = Expect<
        Equal<Schema['Todo']['type']['content'], string | null | undefined>
      >;
    });

    test('Allows the defaulted field to be empty during create', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            createTodo: {
              id: 'some-id',
              content: 'My new Todo',
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      // content is not required at creation time.
      const { data } = await client.models.Todo.create({});

      // non-functional assertions -- the default is provided server-side.
      // just demonstrating that we the field is still returned normally.
      expect(data).toEqual(
        expect.objectContaining({
          content: 'My new Todo',
        }),
      );
    });

    test('Allows a value for the field during create', async () => {
      const { generateClient, spy } = mockedGenerateClient([
        {
          data: {
            createTodo: {
              id: 'some-id',
              content: 'non-default value',
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      // content is not required at creation time.
      const { data } = await client.models.Todo.create({
        content: 'non-default value',
      });

      // the defaulted field exists in the request.
      expectGraphqlMatches(
        optionsAndHeaders(spy)[0][0].query,
        `mutation($input: CreateTodoInput!) {
          createTodo(input: $input) {
            id content createdAt updatedAt
          }
        }`,
      );

      expect(optionsAndHeaders(spy)[0][0].variables).toEqual({
        input: {
          content: 'non-default value',
        },
      });

      // non-functional assertions -- the default is provided server-side.
      // just demonstrating that we the field is still returned normally.
      expect(data).toEqual(
        expect.objectContaining({
          content: 'non-default value',
        }),
      );
    });
  });
});

test('Disallow additional array modifier', () => {
  a.schema({
    ToDo: a.model({
      values: a
        .string()
        .required()
        .array()
        .required()
        // @ts-expect-error
        .array()
        .required(),
    }),
  })
});
