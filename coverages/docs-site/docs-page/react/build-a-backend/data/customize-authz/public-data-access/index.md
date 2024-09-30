[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `21cf216d105e1ece` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "apiKey",
  },
);

~~~

| | |
| -- | -- |
| Hash | `c8110784c3c7df69` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

~~~

| | |
| -- | -- |
| Hash | `02802ed51338dc5f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure({
  ...outputs,
  Auth: {
Cognito: {
  identityPoolId: config.aws_cognito_identity_pool_id,
  userPoolClientId: config.aws_user_pools_web_client_id,
  userPoolId: config.aws_user_pools_id,
  allowGuestAccess: true,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `638c91685ddf6aad` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "identityPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `75bbbc970e89b3dc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
