import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
} from '../../utils';

describe('Result parsing edge cases', () => {
  // edges that were bugs at some point.

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Models with an `items` property', () => {
    // Original implementation assumed `items: T[]` properties were related records
    // and attempted to "flatten" them.

    describe('get operations', () => {
      test('of type `string[]`', async () => {
        // #region mocking
        const schema = a
          .schema({
            Cart: a.model({
              items: a.string().required().array(),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedCart = {
          __typeName: 'Cart',
          id: 'some-cart-id',
          items: ['Tomato', 'Ice', 'Mint'],
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              getCart: expectedCart,
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: cart } = await client.models.Cart.get({
          id: 'some-cart-id',
        });

        // #region assertions
        expect(cart).toEqual(expect.objectContaining(expectedCart));
        // #endregion assertions
      });

      test('of type `SomeCustomType[]`', async () => {
        const schema = a
          .schema({
            SomeCustomType: a.customType({
              name: a.string().required(),
            }),
            Cart: a.model({
              items: a.ref('SomeCustomType').array(),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedCart = {
          __typeName: 'Cart',
          id: 'some-cart-id',
          items: [{ name: 'Tomato' }, { name: 'Ice' }, { name: 'Mint' }],
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              getCart: expectedCart,
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: cart } = await client.models.Cart.get({
          id: 'some-cart-id',
        });

        // #region assertions
        expect(cart).toEqual(expect.objectContaining(expectedCart));
        // #endregion assertions
      });

      test('of some `DeceptiveCustomType` that pretends to be a related model', async () => {
        // #region mocking
        const schema = a
          .schema({
            SomeCustomType: a.customType({
              name: a.string().required(),
            }),
            CustomTypeItems: a.model({
              items: a.ref('SomeCustomType').array(),
            }),
            DeceptiveCustomType: a.customType({
              items: a.ref('SomeCustomType').array(),
            }),
            DeceptiveCustomTypeProp: a.model({
              widgets: a.ref('DeceptiveCustomType'),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedItem = {
          __typeName: 'DeceptiveCustomTypeProp',
          id: 'some-cart-id',
          widgets: {
            items: [{ name: 'Tomato' }, { name: 'Ice' }, { name: 'Mint' }],
          },
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              getDeceptiveCustomTypeProp: expectedItem,
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: cart } = await client.models.DeceptiveCustomTypeProp.get({
          id: 'some-id',
        });

        // #region assertions
        expect(cart).toEqual(expect.objectContaining(expectedItem));
        // #endregion assertions
      });
    });

    describe('list operations', () => {
      test('of type `string[]`', async () => {
        // #region mocking
        const schema = a
          .schema({
            Cart: a.model({
              items: a.string().required().array(),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedCart = {
          __typeName: 'Cart',
          id: 'some-cart-id',
          items: ['Tomato', 'Ice', 'Mint'],
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              listCarts: { items: [expectedCart] },
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: carts } = await client.models.Cart.list();

        // #region assertions
        expect(carts[0]).toEqual(expect.objectContaining(expectedCart));
        // #endregion assertions
      });

      test('of type `SomeCustomType[]`', async () => {
        const schema = a
          .schema({
            SomeCustomType: a.customType({
              name: a.string().required(),
            }),
            Cart: a.model({
              items: a.ref('SomeCustomType').array(),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedCart = {
          __typeName: 'Cart',
          id: 'some-cart-id',
          items: [{ name: 'Tomato' }, { name: 'Ice' }, { name: 'Mint' }],
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              listCarts: { items: [expectedCart] },
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: carts } = await client.models.Cart.list();

        // #region assertions
        expect(carts[0]).toEqual(expect.objectContaining(expectedCart));
        // #endregion assertions
      });

      test('of some `DeceptiveCustomType` that pretends to be a related model', async () => {
        // #region mocking
        const schema = a
          .schema({
            SomeCustomType: a.customType({
              name: a.string().required(),
            }),
            CustomTypeItems: a.model({
              items: a.ref('SomeCustomType').array(),
            }),
            DeceptiveCustomType: a.customType({
              items: a.ref('SomeCustomType').array(),
            }),
            DeceptiveCustomTypeProp: a.model({
              widgets: a.ref('DeceptiveCustomType'),
            }),
          })
          .authorization((allow) => [allow.publicApiKey()]);
        type Schema = ClientSchema<typeof schema>;

        const expectedItem = {
          __typeName: 'DeceptiveCustomTypeProp',
          id: 'some-cart-id',
          widgets: {
            items: [{ name: 'Tomato' }, { name: 'Ice' }, { name: 'Mint' }],
          },
          updatedAt: '2024-03-01T19:05:44.536Z',
          createdAt: '2024-03-01T18:05:44.536Z',
        };

        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              listDeceptiveCustomTypeProps: { items: [expectedItem] },
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();
        // #endregion mocking

        const { data: carts } =
          await client.models.DeceptiveCustomTypeProp.list();

        // #region assertions
        expect(carts[0]).toEqual(expect.objectContaining(expectedItem));
        // #endregion assertions
      });
    });
  });
});
