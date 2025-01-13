[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/

Coverage: 100.0%

#### `amplify/data/resource.ts`

~~~
import {
  a,
  defineData,
  defineFunction,
  type ClientSchema,
} from "@aws-amplify/backend";

const functionWithDataAccess = defineFunction({
  entry: "../functions/data-access.ts",
});

const schema = a
  .schema({
Todo: a.model({
  name: a.string(),
  description: a.string(),
}),
  })
  .authorization((allow) => [allow.resource(functionWithDataAccess)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `06faca1d4de6d812` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L306)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Todo: a.model({
  name: a.string(),
  description: a.string(),
}),
  })
  .authorization((allow) => [
allow.resource(functionWithDataAccess).to(["query", "listen"]),
  ]); // allow query and subscription operations but not mutations

~~~

| | |
| -- | -- |
| Hash | `a23fa5edeff73d65` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L343)

---

#### `amplify/functions/data-access.ts`

~~~
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../data/resource';
import { env } from '$amplify/env/<function-name>'; // replace with your function name


Amplify.configure(
  {
API: {
  GraphQL: {
    endpoint: env.<amplifyData>_GRAPHQL_ENDPOINT, // replace with your defineData name
    region: env.AWS_REGION,
    defaultAuthMode: 'identityPool'
  }
}
  },
  {
Auth: {
  credentialsProvider: {
    getCredentialsAndIdentityId: async () => ({
credentials: {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  sessionToken: env.AWS_SESSION_TOKEN,
},
    }),
    clearCredentialsAndIdentityId: () => {
/* noop */
    },
  },
},
  }
);

const dataClient = generateClient<Schema>();

export const handler = async (event) => {
  // your function code goes here
}

~~~

| | |
| -- | -- |
| Hash | `71dbe766650761ef` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/customize-authz.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/customize-authz.ts#L15)

---

#### `Terminal`

~~~
npx ampx generate graphql-client-code --out <path-function-handler-dir>/graphql

~~~

| | |
| -- | -- |
| Hash | `e91221e30934954b` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/customize-authz.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/customize-authz.ts#L15)

---

#### `amplify/functions/data-access.ts`

~~~
const client = generateClient<Schema>();

export const handler = async (event) => {
  await client.graphql({
query: createTodo,
variables: {
  input: {
    name: "My first todo",
    description: "This is my first todo",
  },
},
  });

  await client.graphql({
query: listTodos,
  });

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `dbf5abada7203d58` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/customize-authz.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/customize-authz.ts#L15)

---

[<- Back to index](../../../../../../docs-pages.md)
