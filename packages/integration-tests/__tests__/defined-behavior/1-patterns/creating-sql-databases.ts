import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type {
  SelectionSet,
  Expect,
  Equal,
  Prettify,
} from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
  expectGraphqlMatches,
  expectGraphqlRequestEquals,
} from '../../utils';

const sqlSchema = a.sql.schema({
  tables: {
    address1: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer1: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address2: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer2: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address3: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer3: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address4: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer4: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address5: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer5: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address6: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer6: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address7: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer7: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
    address8: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer8: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        jobTitle: a.sql.varchar(50),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
  },
});

const schema = a
  .schema({
    Address1: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer1: sqlSchema.tables.customer1.toAPIModel(),
    Address2: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer2: sqlSchema.tables.customer1.toAPIModel(),
    Address3: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer3: sqlSchema.tables.customer1.toAPIModel(),
    Address4: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer4: sqlSchema.tables.customer1.toAPIModel(),
    Address5: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer5: sqlSchema.tables.customer1.toAPIModel(),
    Address6: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer6: sqlSchema.tables.customer1.toAPIModel(),
    Address7: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer7: sqlSchema.tables.customer1.toAPIModel(),
    Address8: sqlSchema.tables.address1
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer8: sqlSchema.tables.customer1.toAPIModel(),
    NonSqlTable: a
      .model({
        a: a.string().required(),
        b: a.integer().required(),
        c: a.string().required(),
      })
      .identifier(['a', 'b', 'c']),
  })
  .authorization((allow) => allow.owner());

type Schema = ClientSchema<typeof schema>;

type TEST = Schema['Address3']['type'];

describe('sql resource definitions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  test('can produce sql table definitions', async () => {
    const sqlDefinition = sqlSchema.transform();
    const expected = {
      tables: [
        {
          tableName: 'address',
          columns: [
            {
              name: 'number',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'street',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'city',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'state',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'zip',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'lat',
              type: 'real',
              isNullable: true,
            },
            {
              name: 'long',
              type: 'real',
              isNullable: true,
            },
          ],
          primaryKey: ['id'],
        },
        {
          tableName: 'customer',
          columns: [
            {
              name: 'firstName',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lastName',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'jobTitle',
              type: 'varchar(50)',
              isNullable: true,
            },
            {
              name: 'bio',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'favoriteColors',
              type: 'varchar',
              isNullable: true,
            },
          ],
          primaryKey: ['firstName', 'lastName'],
        },
      ],
    };
    expect(sqlDefinition).toEqual(expected);
  });

  test('can produce graphql definitions', async () => {
    const transformedGraphql = schema.transform().schema;

    const expected = `
      type Address @model @auth(rules: [
        {allow: owner, ownerField: "owner"},
        {allow: groups, groups: ["Admins"]}
      ]) {
        number: [Int]!
        street: String
        city: String
        state: String
        zip: String
        lat: Float
        long: Float
      }

      type Customer @model @auth(rules: [{allow: owner, ownerField: "owner"}])
      {
        firstName: String! @primaryKey(sortKeyFields: ["lastName"])
        lastName: String!
        jobTitle: String
        bio: String
        favoriteColors: [String]
      }

      type NonSqlTable @model @auth(rules: [{allow: owner, ownerField: "owner"}])
      {
        a: String! @primaryKey(sortKeyFields: ["b", "c"])
        b: Int!
        c: String!
      }
    `;

    expectGraphqlMatches(transformedGraphql, expected);
  });

  test('client can create()', async () => {
    const createCustomer = {
      firstName: 'First',
      lastName: 'Last',
      bio: null,
      favoriteColors: ['red', 'green', 'blue'],
    };
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          createCustomer,
        },
      },
    ]);
    const client = generateClient<Schema>();

    const { data: created } = await client.models.Customer1.create({
      firstName: 'First',
      lastName: 'Last',
      favoriteColors: ['red', 'green', 'blue'],
    });

    expect(created).toEqual(createCustomer);

    expectGraphqlRequestEquals(spy, {
      query: `mutation($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
          firstName lastName jobTitle bio favoriteColors createdAt updatedAt owner
        }
      }`,
      variables: {
        input: {
          firstName: 'First',
          lastName: 'Last',
          favoriteColors: ['red', 'green', 'blue'],
        },
      },
    });
  });

  test('client can get()', async () => {
    const getCustomer = {
      firstName: 'First',
      lastName: 'Last',
      bio: null,
      favoriteColors: ['red', 'green', 'blue'],
    };

    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          getCustomer,
        },
      },
    ]);
    const client = generateClient<Schema>();

    const { data: gotten } = await client.models.Customer1.get({
      firstName: 'First',
      lastName: 'Last',
    });
    expect(gotten).toEqual(getCustomer);

    expectGraphqlRequestEquals(spy, {
      query: `query ($firstName: String!, $lastName: String!) {
        getCustomer(firstName: $firstName, lastName: $lastName) {
          firstName lastName jobTitle bio favoriteColors createdAt updatedAt owner
        }
      }`,
      variables: {
        firstName: 'First',
        lastName: 'Last',
      },
    });
  });
});
