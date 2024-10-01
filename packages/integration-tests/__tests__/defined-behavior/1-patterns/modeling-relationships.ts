import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
} from '../../utils';

describe('Modeling relationships', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Model one-to-many relationship', () => {
    // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-a-one-to-one-relationship
    // #region covers 0d0ad5f8c1b991de
    const schema = a.schema({
      Team: a
        .model({
          mantra: a.string().required(),
          // 3. Create a hasMany relationship with the reference field
          //    from the `Member`s model.
          members: a.hasMany('Member', 'teamId'),
        })
        .authorization((allow) => allow.publicApiKey()),
      Member: a
        .model({
          name: a.string().required(),
          // 1. Create a reference field
          teamId: a.id(),
          // 2. Create a belongsTo relationship with the reference field
          team: a.belongsTo('Team', 'teamId'),
        })
        .authorization((allow) => allow.publicApiKey()),
    });
    // #endregion
    type Schema = ClientSchema<typeof schema>;

    test('create a "Has Many" relationship between records', async () => {
      // #region mocking
      const expectedTeam = {
        __typeName: 'Team',
        id: 'some-team-id',
        mantra: 'Go Frontend!',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: 'some-team-id',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createTeam: expectedTeam,
          },
        },
        {
          data: {
            createMember: expectedMember,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region covers dc7d0a1a6d72510a
      const { data: team } = await client.models.Team.create({
        mantra: 'Go Frontend!',
      });

      const { data: member } = await client.models.Member.create({
        name: 'Tim',
        teamId: team!.id,
      });
      // #endregion

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(team).toEqual(expect.objectContaining(expectedTeam));
      expect(member).toEqual(expect.objectContaining(expectedMember));
      // #endregion assertions
    });

    test('Update a "Has Many" relationship between records', async () => {
      // #region mocking
      const expectedTeam = {
        __typeName: 'Team',
        id: 'new-team-id',
        mantra: 'Go Fullstack',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: 'new-team-id',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createTeam: expectedTeam,
          },
        },
        {
          data: {
            updateMember: expectedMember,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region covers 06214f3775b02364
      const { data: newTeam } = await client.models.Team.create({
        mantra: 'Go Fullstack',
      });

      const { data: updatedMember } = await client.models.Member.update({
        id: 'member-id',
        teamId: newTeam!.id,
      });
      // #endregion

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(newTeam).toEqual(expect.objectContaining(expectedTeam));
      expect(updatedMember).toEqual(expect.objectContaining(expectedMember));
      // #endregion assertions
    });

    test('Delete a "Has Many" relationship between records', async () => {
      // #region mocking
      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: null,
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            updateMember: expectedMember,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region covers f2ae6e917b0bc1b2
      const { data: member } = await client.models.Member.update({
        id: 'member-id',
        teamId: null,
      });
      // #endregion

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(member).toEqual(expect.objectContaining(expectedMember));
      // #endregion assertions
    });

    test('Lazy load a "Has Many" relationship (hasMany side)', async () => {
      // #region mocking
      const expectedTeam = {
        __typeName: 'Team',
        id: 'new-team-id',
        mantra: 'Go Fullstack',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: 'new-team-id',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getTeam: expectedTeam,
          },
        },
        {
          data: {
            listMembers: { items: [expectedMember] },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region covers b02d88e15c6256e8
      // TODO: fix missing non-null assertion on docs site
      // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#lazy-load-a-has-many-relationship
      const { data: team } = await client.models.Team.get({ id: 'team-id' });

      const { data: members } = await team!.members();

      members.forEach((member) => console.log(member.id));
      // #endregion

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(members[0]).toEqual(expect.objectContaining(expectedMember));
      // #endregion assertions
    });

    test('Eagerly load a "Has Many" relationship (hasMany side)', async () => {
      // #region mocking
      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: 'new-team-id',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedTeam = {
        __typeName: 'Team',
        id: 'team-id',
        members: {
          items: [expectedMember],
        },
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getTeam: expectedTeam,
          },
        },
        {
          data: {
            listMembers: { items: [expectedMember] },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region covers ae43c44bff14af30
      // TODO: fix missing non-null assertion on docs site
      // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#eagerly-load-a-has-many-relationship
      const { data: teamWithMembers } = await client.models.Team.get(
        { id: 'team-id' },
        { selectionSet: ['id', 'members.*'] },
      );

      teamWithMembers!.members.forEach((member) => console.log(member.id));
      // #endregion

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(teamWithMembers).toEqual(
        expect.objectContaining({
          id: 'team-id',
          members: [expectedMember],
        }),
      );
      // #endregion assertions
    });

    test('Lazy load a "Has Many" relationship (belongsTo side)', async () => {
      // Not in the docs.

      // #region mocking
      const expectedTeam = {
        __typeName: 'Team',
        id: 'new-team-id',
        mantra: 'Go Fullstack',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedMember = {
        __typeName: 'Member',
        id: 'member-id',
        name: 'Tim',
        teamId: 'new-team-id',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getMember: expectedMember,
          },
        },
        {
          data: {
            getTeam: expectedTeam,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region App code
      const { data: member } = await client.models.Member.get({
        id: 'member-id',
      });

      const { data: team } = await member!.team();
      // #endregion App code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(team).toEqual(expect.objectContaining(expectedTeam));
      // #endregion assertions
    });
  });

  describe('Model a "one-to-one" relationship', () => {
    // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-a-one-to-one-relationship
    const schema = a
      .schema({
        Cart: a.model({
          itemsX: a.string().required().array(),
          // 1. Create reference field
          customerId: a.id(),
          // 2. Create relationship field with the reference field
          customer: a.belongsTo('Customer', 'customerId'),
        }),
        Customer: a.model({
          name: a.string(),
          // 3. Create relationship field with the reference field
          //    from the Cart model
          activeCart: a.hasOne('Cart', 'customerId'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    type Schema = ClientSchema<typeof schema>;

    test('create a "Has One" relationship between records', async () => {
      // #region mocking
      const expectedCustomer = {
        __typeName: 'Customer',
        id: 'customer-id-rene',
        name: 'Rene',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedCart = {
        __typeName: 'Cart',
        id: 'some-cart-id',
        customerId: 'customer-id-rene',
        itemsX: ['Tomato', 'Ice', 'Mint'],
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createCustomer: expectedCustomer,
          },
        },
        {
          data: {
            createCart: expectedCart,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region docs code
      const { data: customer, errors } = await client.models.Customer.create({
        name: 'Rene',
      });

      const { data: cart } = await client.models.Cart.create({
        itemsX: ['Tomato', 'Ice', 'Mint'],
        customerId: customer?.id,
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(customer).toEqual(expect.objectContaining(expectedCustomer));
      expect(cart).toEqual(expect.objectContaining(expectedCart));
      // #endregion assertions
    });

    test('Update a "Has One" relationship between records', async () => {
      // #region mocking
      const expectedCustomer = {
        __typeName: 'Customer',
        id: 'customer-id-ian',
        name: 'Ian',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedCart = {
        __typeName: 'Cart',
        id: 'some-cart-id',
        customerId: 'customer-id-ian',
        itemsX: ['Tomato', 'Ice', 'Mint'],
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createCustomer: expectedCustomer,
          },
        },
        {
          data: {
            updateCart: expectedCart,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region "state" from previous test
      const cart = {
        id: 'some-cart-id',
        customerId: 'some-customer-id',
        itemsX: ['Tomato', 'Ice', 'Mint'],
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };
      // #endregion "state" from previous test

      // #region docs code
      const { data: newCustomer } = await client.models.Customer.create({
        name: 'Ian',
      });

      const { data: updatedCart } = await client.models.Cart.update({
        id: cart.id,
        customerId: newCustomer?.id,
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(newCustomer).toEqual(expect.objectContaining(expectedCustomer));
      expect(updatedCart).toEqual(expect.objectContaining(expectedCart));
      // #endregion assertions
    });

    test('Lazy load a "Has One" relationship (belongsTo side)', async () => {
      // #region mocking
      const expectedCustomer = {
        __typeName: 'Customer',
        id: 'customer-id',
        name: 'Leonard',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedCart = {
        __typeName: 'Cart',
        id: 'some-cart-id',
        customerId: 'customer-id',
        itemsX: ['Tomato', 'Ice', 'Mint'],
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getCart: expectedCart,
          },
        },
        {
          data: {
            getCustomer: expectedCustomer,
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region App code
      const { data: cart } = await client.models.Cart.get({
        id: 'some-cart-id',
      });
      const { data: customer } = await cart!.customer();
      // #endregion App code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(customer).toEqual(expect.objectContaining(expectedCustomer));
      // #endregion assertions
    });

    test('Lazy load a "Has One" relationship (hasOne side)', async () => {
      // Not shown in the docs.

      // #region mocking
      const expectedCustomer = {
        __typeName: 'Customer',
        id: 'customer-id',
        name: 'Leonard',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const expectedCart = {
        __typeName: 'Cart',
        id: 'some-cart-id',
        customerId: 'customer-id',
        itemsX: ['Tomato', 'Ice', 'Mint'],
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getCustomer: expectedCustomer,
          },
        },
        {
          data: {
            // hasOne lazy loader performs a list and just selects the first item
            listCarts: { items: [expectedCart] },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region App code
      const { data: retrievedCustomer } = await client.models.Customer.get({
        id: 'customer-id',
      });
      const { data: lazyLoadedCart } = await retrievedCustomer!.activeCart();
      // #endregion App code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(lazyLoadedCart).toEqual(expect.objectContaining(expectedCart));
      // #endregion assertions
    });
  });
});
