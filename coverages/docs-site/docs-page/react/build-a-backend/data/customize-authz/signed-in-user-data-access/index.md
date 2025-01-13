[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/

Coverage: 100.0%

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.authenticated()]),
});

~~~

| | |
| -- | -- |
| Hash | `9b0106fa74c7ae17` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L142)

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
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `b73cd93b7f81ba2a` |
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
.authorization((allow) => [allow.authenticated("identityPool")]),
});

~~~

| | |
| -- | -- |
| Hash | `b9b26cd28edf59b6` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L514)

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
