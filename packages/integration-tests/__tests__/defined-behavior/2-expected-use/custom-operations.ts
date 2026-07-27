import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type {
  SelectionSet,
  Expect,
  Equal,
} from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
  expectGraphqlMatches,
} from '../../utils';

describe('custom operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const dummyHandler = '' as any;

  // #region covers d9c0f0f657dbbe8a, e394d9c98b1a1f8d
  const schema = a.schema({
    PhoneNumber: a
      .model({
        phoneNumber: a.string().required(),
      })
      .identifier(['phoneNumber'])
      .authorization((allow) => [allow.publicApiKey()]),
    checkBatchOfPhoneNumbersForActiveUsers: a
      .query()
      .arguments({
        phoneNumbers: a.string().array(),
      })
      .returns(a.ref('PhoneNumber').array())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [
        allow.groups(['admin', 'projectManager']),
        allow.publicApiKey(),
      ]),
    findJustOnePhoneNumber: a
      .query()
      .arguments({
        query: a.string(),
      })
      .returns(a.ref('PhoneNumber'))
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    echo: a
      .query()
      .arguments({
        value: a.string(),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    EchoResult: a.customType({
      result: a.string(),
    }),
    echoWithCustomType: a
      .query()
      .arguments({
        value: a.string(),
      })
      .returns(a.ref('EchoResult'))
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    multiEcho: a
      .query()
      .arguments({
        value: a.string(),
      })
      .returns(a.ref('EchoResult').array())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    soloAsync: a
      .query()
      .arguments({
        value: a.string(),
      })
      .handler(a.handler.function(dummyHandler).async())
      .authorization((allow) => [allow.publicApiKey()]),
    asyncSync: a
      .query()
      .arguments({
        value: a.string(),
      })
      .handler([
        a.handler.function(dummyHandler).async(),
        a.handler.function(dummyHandler),
      ])
      .returns(a.ref('EchoResult'))
      .authorization((allow) => [allow.publicApiKey()]),
    syncAsync: a
      .query()
      .arguments({
        value: a.string(),
      })
      .handler([
        a.handler.function(dummyHandler),
        a.handler.function(dummyHandler).async(),
      ])
      .authorization((allow) => [allow.publicApiKey()]),
    syncSync: a
      .query()
      .arguments({
        value: a.string(),
      })
      .handler([
        a.handler.function(dummyHandler),
        a.handler.function(dummyHandler),
      ])
      .returns(a.ref('EchoResult'))
      .authorization((allow) => [allow.publicApiKey()]),
    asyncAsync: a
      .query()
      .arguments({
        value: a.string(),
      })
      .handler([
        a.handler.function(dummyHandler).async(),
        a.handler.function(dummyHandler).async(),
      ])
      .authorization((allow) => [allow.publicApiKey()]),
    CustomArgType: a.customType({
      message: a.string(),
      count: a.integer(),
    }),
    NestedObjectType: a.customType({
      innerField1: a.boolean(),
      innerField2: a.string(),
    }),

    NestedFieldType: a.customType({
      nestedObject1: a.ref('NestedObjectType'),
    }),
    queryWithCustomTypeArg: a
      .query()
      .arguments({
        customArg: a.ref('CustomArgType'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    mutateWithCustomTypeArg: a
      .mutation()
      .arguments({
        customArg: a.ref('CustomArgType'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    mutationWithNestedCustomType: a
      .mutation()
      .arguments({
        nestedField: a.ref('NestedFieldType'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    queryWithRefArg: a
      .query()
      .arguments({
        refArg: a.ref('EchoResult'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    mutationWithRefArg: a
      .mutation()
      .arguments({
        refArg: a.ref('EchoResult'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    ComplexCustomArgType: a.customType({
      field1: a.string(),
      field2: a.integer(),
    }),
    complexQueryOperation: a
      .query()
      .arguments({
        scalarArg: a.string(),
        customArg: a.ref('ComplexCustomArgType'),
        refArg: a.ref('EchoResult'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
    complexMutation: a
      .mutation()
      .arguments({
        scalarArg: a.string(),
        customArg: a.ref('ComplexCustomArgType'),
        refArg: a.ref('EchoResult'),
      })
      .returns(a.string())
      .handler(a.handler.function(dummyHandler))
      .authorization((allow) => [allow.publicApiKey()]),
  });

  type Schema = ClientSchema<typeof schema>;

  type ExpectedQueryWithCustomTypeArg = {
    customArg?: {
      message?: string | null;
      count?: number | null;
    } | null;
  };
  type ActualQuertWithCustomTypeArg = Schema['queryWithCustomTypeArg']['args'];
  type TestEchoWithCustomTypeArg = Expect<
    Equal<ActualQuertWithCustomTypeArg, ExpectedQueryWithCustomTypeArg>
  >;

  type ExpectedMutateWithCustomTypeArg = {
    customArg?: {
      message?: string | null;
      count?: number | null;
    } | null;
  };
  type ActualMutateWithCustomTypeArg =
    Schema['mutateWithCustomTypeArg']['args'];
  type TestMutateWithCustomTypeArg = Expect<
    Equal<ActualMutateWithCustomTypeArg, ExpectedMutateWithCustomTypeArg>
  >;

  type ExpectedNestedCustomTypeArgs = {
    nestedField?: {
      nestedObject1?: {
        innerField1?: boolean | null;
        innerField2?: string | null;
      } | null;
    } | null;
  };
  type ActualNestedCustomTypeArgs =
    Schema['mutationWithNestedCustomType']['args'];
  type TestNestedCustomTypeArgs = Expect<
    Equal<ActualNestedCustomTypeArgs, ExpectedNestedCustomTypeArgs>
  >;

  type ExpectedQueryWithRefArg = {
    refArg?: {
      result?: string | null;
    } | null;
  };
  type ActualQueryWithRefArg = Schema['queryWithRefArg']['args'];
  type TestQueryWithRefArg = Expect<
    Equal<ActualQueryWithRefArg, ExpectedQueryWithRefArg>
  >;

  type ExpectedMutationWithRefArg = {
    refArg?: {
      result?: string | null;
    } | null;
  };
  type ActualMutationWithRefArg = Schema['mutationWithRefArg']['args'];
  type TestMutationWithRefArg = Expect<
    Equal<ActualMutationWithRefArg, ExpectedMutationWithRefArg>
  >;

  type ExpectedComplexQueryArgs = {
    scalarArg?: string | null;
    customArg?: {
      field1?: string | null;
      field2?: number | null;
    } | null;
    refArg?: {
      result?: string | null;
    } | null;
  };
  type ActualComplexArgs = Schema['complexQueryOperation']['args'];
  type TestComplexArgs = Expect<
    Equal<ActualComplexArgs, ExpectedComplexQueryArgs>
  >;

  type ExpectedComplexMutationArgs = {
    scalarArg?: string | null;
    customArg?: {
      field1?: string | null;
      field2?: number | null;
    } | null;
    refArg?: {
      result?: string | null;
    } | null;
  };
  type ActualComplexMutationArgs = Schema['complexMutation']['args'];
  type TestComplexMutationArgs = Expect<
    Equal<ActualComplexMutationArgs, ExpectedComplexMutationArgs>
  >;
  // #endregion

  test('schema.transform() includes custom types, ref types, and operations', () => {
    const transformedSchema = schema.transform();
    const expectedTypes = ['CustomArgType', 'EchoResult', 'Query', 'Mutation'];
    const expectedOperations = [
      'queryWithCustomTypeArg(customArg: CustomArgTypeInput): String',
      'queryWithRefArg(refArg: EchoResultInput): String',
      'mutateWithCustomTypeArg(customArg: CustomArgTypeInput): String',
      'mutationWithRefArg(refArg: EchoResultInput): String',
    ];
    const expectedInputTypes = [
      'input CustomArgTypeInput',
      'input EchoResultInput',
      'input CustomArgTypeInput',
      'input EchoResultInput',
    ];

    expectedTypes.forEach((type) => {
      expect(transformedSchema.schema).toContain(`type ${type}`);
    });

    expectedOperations.forEach((operation) => {
      expect(transformedSchema.schema).toContain(operation);
    });

    expectedInputTypes.forEach((inputType) => {
      expect(transformedSchema.schema).toContain(inputType);
    });
  });
  test('primitive type result', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          echo: 'Echo result',
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();
    // #region covers ffefd700b1e323c9
    const { data } = await client.queries.echo({ value: 'something' });
    // #endregion

    expect(data).toEqual('Echo result');
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('custom type result', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          echoWithCustomType: {
            result: 'custom type echo result',
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data } = await client.queries.echoWithCustomType({
      value: 'something',
    });

    expect(data).toEqual({
      result: 'custom type echo result',
    });
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('custom type array result', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          multiEcho: [
            {
              result: 'CT echo result: hello',
            },
            null, // custom resolvers may return nulls, especially of piping data from dynamo
            {
              result: 'CT echo result: hello',
            },
            {
              result: 'CT echo result: hello',
            },
          ],
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data } = await client.queries.multiEcho({ value: 'something' });
    expect(data).toEqual([
      {
        result: 'CT echo result: hello',
      },
      {
        result: 'CT echo result: hello',
      },
      {
        result: 'CT echo result: hello',
      },
    ]);
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('model result', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          findJustOnePhoneNumber: {
            phoneNumber: '123-123-1234',
            userId: 'some-user-id',
            createdAt: '2024-05-17T22:16:17.712Z',
            updatedAt: '2024-05-17T22:16:17.712Z',
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data } = await client.queries.findJustOnePhoneNumber({
      query: 'something',
    });
    expect(data).toEqual(
      expect.objectContaining({
        phoneNumber: '123-123-1234',
        userId: 'some-user-id',
        createdAt: '2024-05-17T22:16:17.712Z',
        updatedAt: '2024-05-17T22:16:17.712Z',
      }),
    );
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('model array result', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          checkBatchOfPhoneNumbersForActiveUsers: [
            null, // custom resolvers may return nulls, especially of piping data from dynamo
            {
              phoneNumber: '222-2222',
              userId: 'some-user-id',
              createdAt: '2024-05-17T22:15:58.521Z',
              updatedAt: '2024-05-17T22:15:58.521Z',
            },
            {
              phoneNumber: '333-3333',
              userId: 'some-other-user-id',
              createdAt: '2024-05-17T22:16:17.712Z',
              updatedAt: '2024-05-17T22:16:17.712Z',
            },
          ],
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data } =
      await client.queries.checkBatchOfPhoneNumbersForActiveUsers({
        phoneNumbers: ['123', '123'],
      });

    expect(data?.length).toEqual(2);
    expect(data?.[0]).toEqual(
      expect.objectContaining({
        phoneNumber: '222-2222',
        userId: 'some-user-id',
        createdAt: '2024-05-17T22:15:58.521Z',
        updatedAt: '2024-05-17T22:15:58.521Z',
      }),
    );
    expect(data?.[1]).toEqual(
      expect.objectContaining({
        phoneNumber: '333-3333',
        userId: 'some-other-user-id',
        createdAt: '2024-05-17T22:16:17.712Z',
        updatedAt: '2024-05-17T22:16:17.712Z',
      }),
    );
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('solo async handler', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          soloAsync: {
            success: true,
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.soloAsync({
      value: 'hello, world!',
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('async sync', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          asyncSync: {
            result: 'custom type echo result',
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.asyncSync({
      value: 'hello, world!',
    });

    expect(data).toEqual({
      result: 'custom type echo result',
    });
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('sync sync', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          syncSync: {
            result: 'custom type echo result',
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.syncSync({
      value: 'hello, world!',
    });

    expect(data).toEqual({
      result: 'custom type echo result',
    });
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('sync async', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          syncAsync: {
            success: true,
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.syncAsync({
      value: 'hello, world!',
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('async async', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          asyncAsync: {
            success: true,
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.asyncAsync({
      value: 'hello, world!',
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  describe('with enum arguments', () => {
    const schema = a.schema({
      Status: a.enum(['Active', 'Inactive', 'Unknown']),
      echoEnum: a
        .query()
        .arguments({
          status: a.enum(['Active', 'Inactive', 'Unknown']),
        })
        .returns(a.ref('Status'))
        .handler(a.handler.function('name' as any))
        .authorization((allow) => [allow.publicApiKey()]),
    });

    type Schema = ClientSchema<typeof schema>;

    test(`appear with enums values in the ClientSchema['args']`, async () => {
      type ExpectedArgs = {
        status?: 'Active' | 'Inactive' | 'Unknown' | null | undefined;
      };
      type test = Expect<Equal<Schema['echoEnum']['args'], ExpectedArgs>>;
    });

    test('appear in the schema model', async () => {
      /**
       * Relevant invariants:
       *
       * 1. `echoEnum` must have arguments `(status: SOME_ENUM_TYPE_NAME)`
       * 2. `SOME_ENUM_TYPE_NAME` must appear as an enum containing `Active, Inactive, Unknown`
       */
      expectGraphqlMatches(
        schema.transform().schema,
        `
        enum Status {
          Active,
          Inactive,
          Unknown
        }

        enum EchoEnumStatus {
          Active,
          Inactive,
          Unknown
        }

        type Query {
          echoEnum(status: EchoEnumStatus): Status @function(name: "name") @auth(rules: [{allow: public, provider: apiKey}])
        }
      `,
      );
    });

    test('produce operation-namespaced enums in the modelIntrospection schema', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.enums.EchoEnumStatus).toEqual(
        expect.objectContaining({
          name: 'EchoEnumStatus',
          values: ['Active', 'Inactive', 'Unknown'],
        }),
      );
    });

    test('produce query entries referring to the namespaced enum in the modelIntrospection schema', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.queries.echoEnum.arguments).toEqual(
        expect.objectContaining({
          status: {
            name: 'status',
            isArray: false,
            type: { enum: 'EchoEnumStatus' },
            isRequired: false,
          },
        }),
      );
    });

    test('can be called with valid enum values', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { echoEnum: 'Active' },
        },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data } = await client.queries.echoEnum({ status: 'Active' });
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(data).toEqual('Active');
    });

    test('raise type errors when called with invalid enum values', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { echoEnum: 'Active' },
        },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      // @ts-expect-error
      const { data } = await client.queries.echoEnum({ status: 'BAD VALUE' });
    });
  });

  describe('with list arguments', () => {
    const schema = a.schema({
      Color: a.enum(['RED', 'GREEN', 'BLUE']),
      // `[Color!]` -- a nullable list of non-null elements, so omitting the
      // argument is valid.
      nullableList: a
        .query()
        .arguments({
          colors: a.ref('Color').required().array(),
        })
        .returns(a.string())
        .handler(a.handler.function('name' as any))
        .authorization((allow) => [allow.publicApiKey()]),
      // `[Color]!` -- a non-null list, so the argument must be provided.
      requiredList: a
        .query()
        .arguments({
          colors: a.ref('Color').array().required(),
        })
        .returns(a.string())
        .handler(a.handler.function('name' as any))
        .authorization((allow) => [allow.publicApiKey()]),
    });

    type Schema = ClientSchema<typeof schema>;

    test('encode element nullability separately from list nullability in the modelIntrospection schema', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);

      expect(modelIntrospection.queries.nullableList.arguments).toEqual({
        colors: {
          name: 'colors',
          isArray: true,
          type: { enum: 'Color' },
          // element-level: `Color!`
          isRequired: true,
          // list-level: the list itself is nullable
          isArrayNullable: true,
        },
      });

      expect(modelIntrospection.queries.requiredList.arguments).toEqual({
        colors: {
          name: 'colors',
          isArray: true,
          type: { enum: 'Color' },
          isRequired: false,
          isArrayNullable: false,
        },
      });
    });

    test('mark a nullable list argument optional in the ClientSchema args', async () => {
      type ExpectedArgs = {
        colors?: ('RED' | 'GREEN' | 'BLUE')[] | null | undefined;
      };
      type test = Expect<Equal<Schema['nullableList']['args'], ExpectedArgs>>;
    });

    test('mark a non-null list argument required in the ClientSchema args', async () => {
      type ExpectedArgs = {
        colors: ('RED' | 'GREEN' | 'BLUE' | null | undefined)[];
      };
      type test = Expect<Equal<Schema['requiredList']['args'], ExpectedArgs>>;
    });

    test('send the request when a nullable list argument is omitted', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        { data: { nullableList: 'ok' } },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data } = await client.queries.nullableList({});

      expect(data).toEqual('ok');

      const [[options]] = optionsAndHeaders(spy);
      expectGraphqlMatches(
        options.query,
        `
        query($colors: [Color!]) {
          nullableList(colors: $colors)
        }
      `,
      );
      expect(options.variables).toEqual({});
    });

    test('send a nullable list argument as a variable when provided', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        { data: { nullableList: 'ok' } },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      await client.queries.nullableList({ colors: ['RED', 'BLUE'] });

      const [[options]] = optionsAndHeaders(spy);
      expect(options.variables).toEqual({ colors: ['RED', 'BLUE'] });
    });

    test('throw before sending when a non-null list argument is omitted', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        { data: { requiredList: 'ok' } },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      await expect(
        // @ts-expect-error `colors` is a required property of the args type, as
        // pinned above -- only untyped callers can reach the runtime check.
        client.queries.requiredList({}),
      ).rejects.toThrow("requiredList requires arguments 'colors'");

      expect(optionsAndHeaders(spy)).toEqual([]);
    });

    test('render a non-null list argument as a non-null variable', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        { data: { requiredList: 'ok' } },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      await client.queries.requiredList({ colors: ['RED'] });

      const [[options]] = optionsAndHeaders(spy);
      expectGraphqlMatches(
        options.query,
        `
        query($colors: [Color]!) {
          requiredList(colors: $colors)
        }
      `,
      );
    });
  });
});
