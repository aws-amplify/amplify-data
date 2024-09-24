[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/

Coverage: 0.0%

#### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
Customer: a
  .model({
    customerId: a.id().required(),
    // fields can be of various scalar types,
    // such as string, boolean, float, integers etc.
    name: a.string(),
    // fields can be of custom types
    location: a.customType({
// fields can be required or optional
lat: a.float().required(),
long: a.float().required(),
    }),
    // fields can be enums
    engagementStage: a.enum(["PROSPECT", "INTERESTED", "PURCHASED"]),
    collectionId: a.id(),
    collection: a.belongsTo("Collection", "collectionId"),
    // Use custom identifiers. By default, it uses an `id: a.id()` field
  })
  .identifier(["customerId"]),
Collection: a
  .model({
    customers: a.hasMany("Customer", "collectionId"), // setup relationships between types
    tags: a.string().array(), // fields can be arrays
    representativeId: a.id().required(),
    // customize secondary indexes to optimize your query performance
  })
  .secondaryIndexes((index) => [index("representativeId")]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `1f807200986a702a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { defineData } from "@aws-amplify/backend";

const schema = /* GraphQL */ `
  type Todo @model @auth(rules: [{ allow: owner }]) {
content: String
isDone: Boolean
  }
`;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `18d9bf46eea33c9b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
