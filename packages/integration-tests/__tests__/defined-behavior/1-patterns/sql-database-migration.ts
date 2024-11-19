import { a, ClientSchema, sql } from '@aws-amplify/data-schema';
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
  expectGraphqlMatches,
  expectGraphqlRequestEquals,
} from '../../utils';

const sqlSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      lat: a.sql.real(),
      long: a.sql.real(),
    }),
    customer: a.sql
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

const migrated = sqlSchema.addMigration((existing) =>
  existing()
    .alter('address')
    .renameField('city', 'town')
    .done()
    .alter('address')
    .renameField('town', 'village')
    .removeField('zip')
    .addField('zipCode', a.sql.varchar().required())
    .done()
    .alter('customer')
    .renameTo('person')
    .done(),
);

const schema = a
  .schema({
    Address: migrated.tables.address
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer: migrated.tables.person.toAPIModel(),
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

describe('sql resource definitions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  test('can produce sql table definitions', async () => {
    const sqlDefinition = migrated.transform();
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
              name: 'state',
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
            {
              name: 'village',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'zipCode',
              type: 'varchar',
              isNullable: false,
            },
          ],
          primaryKey: ['id'],
        },
        {
          tableName: 'person',
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
        state: String
        lat: Float
        long: Float
        village: String
        zipCode: String!
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

    const { data: created } = await client.models.Customer.create({
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

    const { data: gotten } = await client.models.Customer.get({
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
