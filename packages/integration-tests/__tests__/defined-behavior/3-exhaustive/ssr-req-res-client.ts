import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
} from '../../utils';

/* eslint-disable import/no-extraneous-dependencies */
import { GraphQLAPI } from '@aws-amplify/api-graphql';
import { getAmplifyServerContext } from '@aws-amplify/core/internals/adapter-core';
/* eslint-enable import/no-extraneous-dependencies */

jest.mock('@aws-amplify/core/internals/adapter-core', () => ({
  getAmplifyServerContext: jest.fn(),
}));

describe('something', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const schema = a
    .schema({
      StandaloneModel: a
        .model({
          name: a.string(),
        })
        .secondaryIndexes((index) => [index('name')]),
      Parent: a.model({
        name: a.string(),
        children: a.hasMany('Child', 'parentId'),
      }),
      Child: a.model({
        name: a.string(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
      MyQueryReturnType: a.customType({
        success: a.boolean(),
      }),
      myQuery: a
        .query()
        .arguments({ id: a.string() })
        .returns(a.customType({ success: a.boolean() }))
        .handler(a.handler.function('MyFn')),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  test('happy path type and mocked runtime tests', async () => {
    const { spy, generateServerClientUsingReqRes } = mockedGenerateClient([
      {
        data: {
          getStandaloneModel: {
            id: 'some-id',
            name: 'something',
          },
        },
      },
      {
        data: {
          listStandaloneModel: [
            {
              id: 'some-id',
              name: 'something',
            },
          ],
        },
      },
      {
        data: {
          listStandaloneModelByName: [
            {
              id: 'some-id',
              name: 'something',
            },
          ],
        },
      },
      {
        data: {
          myQuery: [
            {
              success: true,
            },
          ],
        },
      },
    ]);

    spy.mockImplementation(async (test) => {
      return (GraphQLAPI as any)._graphql();
    });

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    (getAmplifyServerContext as jest.Mock).mockImplementation(() => {
      // the actual impl. of getAmplifyServerContext fetches the Amplify instance from a local registry
      // based on the provided contextSpec (for SSR context isolation)
      // we're mocking it to return the Amplify instance we just configured above
      return { amplify: Amplify };
    });

    // #region covers 062b069c31e86ca5
    const client = generateServerClientUsingReqRes<Schema>({
      config,
    });

    const mockContextSpec = { token: { value: Symbol('mock-token') } };

    await client.models.StandaloneModel.get(mockContextSpec, {
      id: 'something',
    });

    await client.models.StandaloneModel.list(mockContextSpec);

    await client.models.StandaloneModel.listStandaloneModelByName(
      mockContextSpec,
      { name: 'bob' },
    );

    await client.queries.myQuery(mockContextSpec, { id: 'a1' });
    // #endregion

    const calls = spy.mock.calls;

    expect(calls[0]).toEqual([
      Amplify,
      expect.objectContaining({
        query: expect.stringContaining('getStandaloneModel'),
        variables: { id: 'something' },
      }),
      {},
    ]);

    expect(calls[1]).toEqual([
      Amplify,
      expect.objectContaining({
        query: expect.stringContaining('listStandaloneModels'),
      }),
      {},
    ]);

    expect(calls[2]).toEqual([
      Amplify,
      expect.objectContaining({
        query: expect.stringContaining('listStandaloneModelByName'),
        variables: { name: 'bob' },
      }),
      {},
    ]);

    expect(calls[3]).toEqual([
      Amplify,
      expect.objectContaining({
        query: expect.stringContaining('myQuery'),
        variables: { id: 'a1' },
      }),
      {},
    ]);

    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });
});
