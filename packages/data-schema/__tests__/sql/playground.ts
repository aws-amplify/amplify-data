import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../../src/index';

const sqlSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      number: a.sql.field('number').array().required(),
      street: a.sql.field('string'),
      city: a.sql.field('string'),
      state: a.sql.field('string'),
      zip: a.sql.field('string'),
    }),
    customer: a.sql.table({
      firstName: a.sql.field('string'),
      lastName: a.sql.field('number'),
      favoriteColors: a.sql.field('string').array(),
      // address: sql.ref('address'),
    }),
  },
});

const schema = a.schema({
  Address: sqlSchema.tables.address.toAPIModel(),
});

type Schema = ClientSchema<typeof schema>;
