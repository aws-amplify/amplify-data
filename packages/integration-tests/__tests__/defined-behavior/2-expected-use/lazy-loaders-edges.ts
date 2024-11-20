import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectGraphqlMatches,
  useState,
} from '../../utils';

describe('lazy loaders edges', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const schema = a
    .schema({
      Parent: a.model({
        name: a.string().required(),
        children: a.hasMany('HasManyChild', 'parentId'),
        child: a.hasOne('HasOneChild', 'parentId'),
      }),
      HasManyChild: a.model({
        name: a.string().required(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
      HasOneChild: a.model({
        name: a.string().required(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  const compositeKeySchema = a.schema({
    Order: a.model({
      id: a.id(),
      customerFirstName: a.string().required(),
      customerLastName: a.string().required(),
      customerRegion: a.string().required(),
      customer: a.belongsTo('Customer', ['customerFirstName','customerLastName', 'customerRegion']),
    }).authorization(allow => [allow.publicApiKey()]),
    Customer: a.model({
      customerFirstName: a.string().required(),
      customerLastName: a.string().required(),
      customerRegion: a.string().required(),
      orders: a.hasMany('Order', ['customerFirstName','customerLastName', 'customerRegion']),
    }).identifier(['customerFirstName', 'customerLastName','customerRegion']).authorization(allow => [allow.publicApiKey()]),
  })

  type CompositeKeySchema = ClientSchema<typeof compositeKeySchema>;

  test('belongsTo: related data is queried with foreign keys', async() => {
    const { generateClient, spy} = mockedGenerateClient([
      {
        data: {
          getOrder: {
            __typeName: 'Order',
            id: 'order-id',
            customerFirstName: 'Some First Name',
            customerLastName: 'Some Last Name',
            customerRegion: 'Region A',
            updatedAt: '2024-03-01T19:05:44.536Z',
            createdAt: '2024-03-01T18:05:44.536Z',
          },
        },
      },
      {
        data: {
          getCustomer: {
            __typeName: 'Customer',
            customerFirstName: 'Some First Name',
            customerLastName: 'Some Last Name',
            region: 'Region A',
            orders: [
              {
                __typeName: 'Order',
                id: 'order-id',
                customerFirstName: 'Some First Name',
                customerLastName: 'Some Last Name',
                customerRegion: 'Region A',
                updatedAt: '2024-03-01T19:05:44.536Z',
                createdAt: '2024-03-01T18:05:44.536Z',
              },
            ],
            updatedAt: '2024-03-01T19:05:44.536Z',
            createdAt: '2024-03-01T18:05:44.536Z',
          },
        },
      },
      {
        data: {
          getCustomer: {
            __typeName: 'Customer',
            customerFirstName: 'Another First Name',
            customerLastName: 'Another Last Name',
            customerRegion: 'Region B',
            orders: [
            ],
            updatedAt: '2077-03-01T19:05:44.536Z',
            createdAt: '2077-03-01T18:05:44.536Z',
          },
        },
      },
    ]);
    const config = await buildAmplifyConfig(compositeKeySchema);
    Amplify.configure(config);
    const client = generateClient<CompositeKeySchema>();

    const { data: order } = await client.models.Order.get({
      id: 'order-id',
    });
    const { data: customer } = await order!.customer();

    //both primary key and sort key are used in query
    expectGraphqlMatches(
      optionsAndHeaders(spy)[1][0].query,
      `query($customerFirstName: String!,$customerLastName: String!, $customerRegion: String!) 
      { getCustomer(customerFirstName: $customerFirstName,customerLastName: $customerLastName,
        customerRegion: $customerRegion) 
        { customerFirstName customerLastName customerRegion createdAt updatedAt } }`,
    );

    //sort keys are processed by the reduce() correctly
    expect(optionsAndHeaders(spy)[1][0].variables).toEqual({
      customerFirstName: 'Some First Name',
      customerLastName: 'Some Last Name',
      customerRegion: 'Region A',
    })
  });

  describe('when target data does not exist', () => {
    test('hasMany: returns []', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getParent: {
              __typeName: 'Parent',
              id: 'parent-id',
              name: 'Some Parent',
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
        {
          data: {
            listHasManyChilds: [],
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: parent } = await client.models.Parent.get({
        id: 'parent-id',
      });
      const { data: lazyLoaded } = await parent!.children();

      expect(lazyLoaded).toEqual([]);
    });

    test('hasOne: returns null', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getParent: {
              __typeName: 'Parent',
              id: 'parent-id',
              name: 'Some Parent',
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
        {
          data: {
            listHasOneChild: [],
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: parent } = await client.models.Parent.get({
        id: 'parent-id',
      });
      const { data: lazyLoaded } = await parent!.child();

      expect(lazyLoaded).toEqual(null);
    });

    test('belongsTo (from hasMany): returns null', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getHasManyChild: {
              __typeName: 'HasManyChild',
              id: 'child-id',
              name: 'Some Child',
              parentId: 'some-parent',
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
        {
          data: {
            getParent: null,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: child } = await client.models.HasManyChild.get({
        id: 'child-id',
      });
      const { data: lazyLoaded } = await child!.parent();

      expect(lazyLoaded).toEqual(null);
    });

    test('belongsTo (from hasOne): returns null', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getHasOneChild: {
              __typeName: 'HasOneChild',
              id: 'child-id',
              name: 'Some Child',
              parentId: 'some-parent',
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
        {
          data: {
            getParent: null,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: child } = await client.models.HasOneChild.get({
        id: 'child-id',
      });
      const { data: lazyLoaded } = await child!.parent();

      expect(lazyLoaded).toEqual(null);
    });
  });

  describe('when key (PK or FK) is empty', () => {
    test('belongsTo (from hasMany): returns null', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getHasManyChild: {
              __typeName: 'HasManyChild',
              id: 'child-id',
              name: 'Some Child',
              parentId: null,
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: child } = await client.models.HasManyChild.get({
        id: 'child-id',
      });
      const { data: lazyLoaded } = await child!.parent();

      expect(lazyLoaded).toEqual(null);
    });

    test('belongsTo (from hasOne): returns null', async () => {
      const { generateClient } = mockedGenerateClient([
        {
          data: {
            getHasOneChild: {
              __typeName: 'HasOneChild',
              id: 'child-id',
              name: 'Some Child',
              parentId: null,
              updatedAt: '2024-03-01T19:05:44.536Z',
              createdAt: '2024-03-01T18:05:44.536Z',
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: child } = await client.models.HasOneChild.get({
        id: 'child-id',
      });
      const { data: lazyLoaded } = await child!.parent();

      expect(lazyLoaded).toEqual(null);
    });
  });
});
