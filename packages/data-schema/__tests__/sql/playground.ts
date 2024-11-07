import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../../src/index';

const sqlSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
    }),
    customer: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
  },
});

const schema = a
  .schema({
    Address: sqlSchema.tables.address
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer: sqlSchema.tables.customer.toAPIModel(),
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
              isNullable: true,
            },
            {
              name: 'street',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'city',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'state',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'zip',
              type: 'varchar',
              isNullable: false,
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
              isNullable: true,
            },
            {
              name: 'lastName',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'bio',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'favoriteColors',
              type: 'varchar',
              isNullable: false,
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

    const expected = `type Address @model @auth(rules: [{allow: owner, ownerField: "owner"},
  {allow: groups, groups: ["Admins"]}])
{
  number: [Int]!
  street: String
  city: String
  state: String
  zip: String
}

type Customer @model @auth(rules: [{allow: owner, ownerField: "owner"}])
{
  firstName: String! @primaryKey(sortKeyFields: ["lastName"])
  lastName: String!
  bio: String
  favoriteColors: [String]
}

type NonSqlTable @model @auth(rules: [{allow: owner, ownerField: "owner"}])
{
  a: String! @primaryKey(sortKeyFields: ["b", "c"])
  b: Int!
  c: String!
}`;

    expect(transformedGraphql).toEqual(expected);
  });

  test('ClientSchema types', () => {
    type AddressType = Schema['Address']['type'];

    type ExpectedType = {
      number: number[];
      street?: string | null | undefined;
      city?: string | null | undefined;
      state?: string | null | undefined;
      zip?: string | null | undefined;
      owner?: string | null | undefined;
      readonly createdAt: string;
      readonly updatedAt: string;
    };

    type AddressCreateType = Schema['Address']['createType'];

    type NonSqlTableType = Schema['NonSqlTable']['type'];
    type ExpectedNonSqlTableType = {
      a: string;
      b: number;
      c: string;
      owner?: string | null | undefined;
      readonly createdAt: string;
      readonly updatedAt: string;
    };
  });
});
