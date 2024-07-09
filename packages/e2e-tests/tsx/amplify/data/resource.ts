import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});

// type Person @model {
//   id: ID! @primaryKey
//   authorPosts: [Post] @hasMany(references: ["authorId"])
//   editorPosts: [Post] @hasMany(references: ["editorId"])
// }

// type Post @model {
//   authorId: ID!
//    author: Person @belongsTo(references: ["authorId"]
//   editorId: ID!
//   editor: Person @belongsTo(references: ["editorId"]
// }

// Docs schemas?

// Current E2E schema?
