import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.guest()]),
  CRUDLTestModel: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
  SubTestModel: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
