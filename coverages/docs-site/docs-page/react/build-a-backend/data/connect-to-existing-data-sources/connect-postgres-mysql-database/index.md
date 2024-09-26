[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/

Coverage: 37.5%

#### `Unnamed Snippet`

~~~
npx ampx sandbox secret set SQL_CONNECTION_STRING

~~~

| | |
| -- | -- |
| Hash | `c51525983af82763` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/cli-commands.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### `Unnamed Snippet`

~~~
mysql://user:password@hostname:port/db-name

~~~

| | |
| -- | -- |
| Hash | `28870705b76cb2ef` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/cli-commands.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### `Unnamed Snippet`

~~~
postgres://user:password@hostname:port/db-name

~~~

| | |
| -- | -- |
| Hash | `635b91f7a060cdf5` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/cli-commands.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### `Unnamed Snippet`

~~~
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --out amplify/data/schema.sql.ts

~~~

| | |
| -- | -- |
| Hash | `7d93bdb952442e03` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/cli-commands.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### `Terminal`

~~~
npx ampx sandbox secret set CUSTOM_SSL_CERT < /path/to/custom/ssl/public-ca-cert.pem
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --ssl-cert-secret CUSTOM_SSL_CERT --out amplify/data/schema.sql.ts

~~~

| | |
| -- | -- |
| Hash | `4945f33e55d33118` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/cli-commands.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from "./schema.sql";

// Add a global authorization rule
const sqlSchema = generatedSqlSchema.authorization((allow) => allow.guest());

// Relational database sources can coexist with DynamoDB tables managed by Amplify.
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

// Use the a.combine() operator to stitch together the models backed by DynamoDB
// and the models backed by Postgres or MySQL databases.
const combinedSchema = a.combine([schema, sqlSchema]);

// Don't forget to update your client types to take into account the types from
// both schemas.
export type Schema = ClientSchema<typeof combinedSchema>;

export const data = defineData({
  // Update the data definition to use the combined schema, instead of just
  // your DynamoDB-backed schema
  schema: combinedSchema,
});

~~~

| | |
| -- | -- |
| Hash | `36f544daf9ca0bc2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// Add an authorization rule to the schema
const sqlSchema = generatedSqlSchema.setAuthorization((models) => [
  // Model-level authorization rules
  models.event.authorization((allow) => [allow.publicApiKey()]),
  // Field-level authorization rules
  models.event.fields.id.authorization((allow) => [
allow.publicApiKey(),
allow.guest(),
  ]),
  models.event.fields.created_at.authorization((allow) => [
allow.publicApiKey(),
allow.guest(),
  ]),
]);

~~~

| | |
| -- | -- |
| Hash | `8ae1c7b151eacfde` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/common.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7)

---

#### `Unnamed Snippet`

~~~
const { data: events } = await client.models.event.list();

~~~

| | |
| -- | -- |
| Hash | `d9dc661c8e8c0dd4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// Rename models or fields to be more idiomatic for frontend code
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .renameModels(() => [
//⌄⌄⌄⌄⌄ existing model name based on table name
["event", "Event"],
//        ^^^^^^ renamed data model name
  ]);

~~~

| | |
| -- | -- |
| Hash | `748c6c140a7867a7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .setRelationships((models) => [
models.Note.relationships({
  comments: a.hasMany("Comment", "note_id"),
}),
models.Comment.relationships({
  note: a.belongsTo("Note", "note_id"),
}),
  ]);

~~~

| | |
| -- | -- |
| Hash | `4ac6eb92952f0637` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// Add custom mutations or queries that execute SQL statements
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .addToSchema({
listEventsWithDecodedLatLong: a
  .query()
  // reference custom types added to the schema
  .returns(a.ref("EventWithDecodedCoord").array())
  .handler(
    a.handler.inlineSql(
`SELECT
  id,
  name,
  address,
  ST_X(geom) AS longitude,
  ST_Y(geom) AS latitude
FROM locations;`,
    ),
  )
  .authorization((allow) => [allow.guest()]),

// Define custom types to provide end-to-end typed results
// for custom queries / mutations
EventWithDecodedCoord: a.customType({
  id: a.integer(),
  name: a.string(),
  address: a.string(),
  longitude: a.float(),
  latitude: a.float(),
}),
  });

~~~

| | |
| -- | -- |
| Hash | `5071d6595a7426a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .addToSchema({
createNewLocationWithLongLat: a
  .mutation()
  .arguments({
    lat: a.float().required(),
    long: a.float().required(),
    name: a.string().required(),
    address: a.string().required(),
  })
  .returns(a.json().array())
  .authorization((allow) => allow.authenticated())
  .handler(a.handler.sqlReference("./createNewLocationWithLongLat.sql")),
  });

~~~

| | |
| -- | -- |
| Hash | `26ed39c38206c91e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `createNewLocationWithLongLat.sql`

~~~
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_GEOMFROMTEXT(CONCAT('POINT (', :long, ' ', :lat, ')'), 4326));

~~~

| | |
| -- | -- |
| Hash | `62da717f535147ae` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `createNewLocationWithLongLat.sql`

~~~
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_SetSRID(ST_MakePoint(:long, :lat), 4326))

~~~

| | |
| -- | -- |
| Hash | `34cb4b8726c31609` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
getPostBySlug: a.query()
  .arguments({
slug: a.string().required(),
  })
  .returns(a.ref("Post").array())
  .handler(
a.handler.inlineSql(`
SELECT id, title, slug, content, created_at, updated_at
FROM posts
WHERE slug = :slug;
`),
  );

~~~

| | |
| -- | -- |
| Hash | `f36866db1e6435b0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
