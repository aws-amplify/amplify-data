import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
} from '../../utils';

describe('custom operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const dummyHandler = '' as any;

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
  });

  type Schema = ClientSchema<typeof schema>;

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

    const { data } = await client.queries.echo({ value: 'something' });

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
            success: true
          }
        }
      }
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.soloAsync({
      value: 'hello, world!'
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      })
    )
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
      value: 'hello, world!'
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
      value: 'hello, world!'
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
            success: true
          }
        }
      }
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.syncAsync({
      value: 'hello, world!'
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      })
    )
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('async async', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          asyncAsync: {
            success: true
          }
        }
      }
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    const client = generateClient<Schema>();

    const { data } = await client.queries.asyncAsync({
      value: 'hello, world!'
    });

    expect(data).toEqual(
      expect.objectContaining({
        success: true,
      })
    )
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });
});
