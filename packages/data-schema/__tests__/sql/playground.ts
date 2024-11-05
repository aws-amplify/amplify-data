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
    customer: a.sql.table({
      firstName: a.sql.varchar(),
      lastName: a.sql.varchar(),
      bio: a.sql.text(),
      favoriteColors: a.sql.varchar().array(),
      // address: sql.ref('address'),
    }),
  },
});

const schema = a.schema({
  Address: sqlSchema.tables.address.toAPIModel(),
});

type Schema = ClientSchema<typeof schema>;

type TEST001 = Schema['Address']['type'];
