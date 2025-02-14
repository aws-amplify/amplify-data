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
    person: a.sql.table({
      name: a.sql.varchar(),
      age: a.sql.int(),
    }),
    user: a.sql.table({
      id: a.sql.int().required(),
      name: a.sql.varchar(),
      email: a.sql.varchar(),
      created_at: a.sql.timestamp().required(),
    }),
  },
});

const schema = a.schema({
  Address: sqlSchema.tables.address.toAPIModel(),
  Person: sqlSchema.tables.person.toAPIModel(),
  User: sqlSchema.tables.user.toAPIModel(),
});

export type MySQLSchema = typeof sqlSchema;
export type Schema = ClientSchema<typeof schema>;
