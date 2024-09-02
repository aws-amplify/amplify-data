import { defineData } from '@aws-amplify/backend';

// const schema = /* GraphQL */ `
const schema = `
  type Todo @model @auth(rules: [{ allow: owner }]) {
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
