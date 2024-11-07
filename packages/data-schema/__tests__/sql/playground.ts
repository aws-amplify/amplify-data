import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../../src/index';
import { EligibleIdFields } from '../../src/sql';

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

const sample = a.sql.table({
  firstName: a.sql.varchar().required(),
  lastName: a.sql.varchar().required(),
  bio: a.sql.text(),
  age: a.sql.int(),
});

type Sample = typeof sqlSchema.tables.customer;

type IdSample = EligibleIdFields<Sample>;

const schema = a
  .schema({
    Address: sqlSchema.tables.address
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer: sqlSchema.tables.customer.toAPIModel(),
    SomethingElse: a
      .model({
        a: a.string().required(),
        b: a.integer().required(),
        c: a.string().required(),
      })
      .identifier(['a', 'b', 'c']),
  })
  .authorization((allow) => allow.owner());

type Schema = ClientSchema<typeof schema>;

type AddressType = Schema['Address']['type'];

type CustomerType = Schema['Customer']['type'];

type CustomerTypePK = Schema['Customer']['identifier'];

type SamplePk = Schema['SomethingElse']['identifier'];

describe('sql resource definitions', () => {
  test('playground', async () => {
    const transformedGraphql = schema.transform().schema;
    const sqlDefinition = sqlSchema.transform();
    console.log(
      'transformedGraphql:',
      transformedGraphql,
      '\n\nsqlDefinition:',
      JSON.stringify(sqlDefinition, null, 2),
    );
  });
});
