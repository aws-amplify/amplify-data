import { defineData } from '@aws-amplify/backend';
import { type ClientSchema, a, manageMigrations } from '@aws-amplify/data-schema';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
export const sqlSchema = a.sql.schema({
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

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

export type MySQLSchema = typeof sqlSchema;
export const migrations = manageMigrations(sqlSchema);

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
