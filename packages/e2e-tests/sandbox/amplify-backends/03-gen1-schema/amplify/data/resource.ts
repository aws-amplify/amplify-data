import { defineData } from '@aws-amplify/backend';

const schema = /* GraphQL */ `
  type Todo @model @auth(rules: [{ allow: public }]) {
    content: String
    isDone: Boolean
  }
`;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
