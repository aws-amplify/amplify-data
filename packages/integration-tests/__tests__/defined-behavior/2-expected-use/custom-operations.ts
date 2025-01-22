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
      'queryWithCustomTypeArg(customArg: QueryWithCustomTypeArgCustomArgInput): String',
      'queryWithRefArg(refArg: QueryWithRefArgRefArgInput): String',
      'mutateWithCustomTypeArg(customArg: MutateWithCustomTypeArgCustomArgInput): String',
      'mutationWithRefArg(refArg: MutationWithRefArgRefArgInput): String',
    ];
    const expectedInputTypes = [
      'input QueryWithCustomTypeArgCustomArgInput',
      'input QueryWithRefArgRefArgInput',
      'input MutateWithCustomTypeArgCustomArgInput',
      'input MutationWithRefArgRefArgInput',
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
});
