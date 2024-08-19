import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from '@aws-amplify/backend';

const echoHandler = defineFunction({
  entry: './echo-handler/handler.ts',
});

const schema = a.schema({
  Post: a
    .model({
      content: a.string(),
      likes: a
        .integer()
        .authorization((allow) => [allow.authenticated().to(['read'])]),
      newField1: a.string(),
      newField2: a.string(),
    })
    .authorization((allow) => [allow.authenticated().to(['read'])]),
  Post2: a
    .model({
      content: a.string(),
      likes: a
        .integer()
        .authorization((allow) => [allow.authenticated().to(['read'])]),
      newField1: a.string(),
      newField2: a.string(),
    })
    .authorization((allow) => [allow.authenticated().to(['read'])]),
  likePost: a
    .mutation()
    .arguments({ newField: a.string() })
    .returns(a.ref('Post2'))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('Post2'),
        entry: './replacement.js',
      }),
    ),
  EchoResponse: a.customType({
    content: a.string(),
    newField1: a.string(),
    executionDuration: a.float(),
  }),
  EchoResponse2: a.customType({
    content: a.string(),
    newField1: a.string(),
    executionDuration: a.float(),
  }),
  echo: a
    .query()
    .arguments({ content: a.string(), newField: a.string() })
    .returns(a.ref('EchoResponse2'))
    .authorization((allow) => [allow.publicApiKey()])
    // 3. set the function has the handler
    .handler(a.handler.function(echoHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 5,
    },
  },
});
