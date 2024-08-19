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
      likes: a.integer().authorization((allow) => [allow.authenticated()]),
    })
    .authorization((allow) => [allow.authenticated()]),
  likePost: a
    .mutation()
    .arguments({ postId: a.id() })
    .returns(a.ref('Post'))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('Post'),
        entry: './increment-like.js',
      }),
    ),
  EchoResponse: a.customType({
    content: a.string(),
    executionDuration: a.float(),
  }),
  echo: a
    .query()
    .arguments({ content: a.string() })
    .returns(a.ref('EchoResponse'))
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
      expiresInDays: 30,
    },
  },
});
