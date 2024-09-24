[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/

Coverage: 0.0%

#### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
UserProfile: a
  .model({
    email: a.string(),
    profileOwner: a.string(),
  })
  .authorization((allow) => [allow.ownerDefinedIn("profileOwner")]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
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
| Hash | `f2fd0d9df88405a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/post-confirmation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
});

~~~

| | |
| -- | -- |
| Hash | `8b9530b61f2b2da4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx generate graphql-client-code --out <path-to-post-confirmation-handler-dir>/graphql

~~~

| | |
| -- | -- |
| Hash | `c6c70644fbaf72c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/post-confirmation/handler.ts`

~~~
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/post-confirmation";
import { createUserProfile } from "./graphql/mutations";

Amplify.configure(
  {
API: {
  GraphQL: {
    endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
    region: env.AWS_REGION,
    defaultAuthMode: "iam",
  },
},
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
  },
);

const client = generateClient<Schema>({
  authMode: "iam",
});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.graphql({
query: createUserProfile,
variables: {
  input: {
    email: event.request.userAttributes.email,
    profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
  },
},
  });

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `98f9c783075cf76e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
postConfirmation,
  },
});

~~~

| | |
| -- | -- |
| Hash | `0241a55956ce0589` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
