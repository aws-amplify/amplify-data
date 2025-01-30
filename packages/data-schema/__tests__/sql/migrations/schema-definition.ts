import { a, ClientSchema } from "../../../src";

const sqlSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      name: a.sql.varchar(),
      number: a.sql.int(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      details: a.sql.text(),
    }),
  },
});

const schema = a.schema({
  Address: sqlSchema.tables.address.toAPIModel(),
});

export type Schema = ClientSchema<typeof schema>;
