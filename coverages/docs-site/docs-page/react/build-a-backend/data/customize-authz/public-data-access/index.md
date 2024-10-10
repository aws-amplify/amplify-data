[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/

Coverage: 100.0%

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L15)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L51)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L161)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L231)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/customize-authz.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/customize-authz.ts#L20)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L51)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L161)

---

[<- Back to index](../../../../../../docs-pages.md)
