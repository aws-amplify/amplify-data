[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/

Coverage: 100.0%

#### `amplify/data/resource.ts`

~~~
// allow one specific group
const schema = a.schema({
  Salary: a
.model({
  wage: a.float(),
  currency: a.string(),
})
.authorization((allow) => [allow.group("Admin")]),
});

~~~

| | |
| -- | -- |
| Hash | `3558bb1b245a4672` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L142)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// As a signed-in user that belongs to the 'Admin' User Pool Group
const { errors, data: newSalary } = await client.models.Salary.create(
  {
wage: 50.25,
currency: "USD",
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `573fd6a09fd9031f` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L51)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L161)

---

#### `Unnamed Snippet`

~~~
// allow multiple specific groups
const schema = a.schema({
  Salary: a
.model({
  wage: a.float(),
  currency: a.string(),
})
.authorization((allow) => [allow.groups(["Admin", "Leadership"])]),
});

~~~

| | |
| -- | -- |
| Hash | `17dfb540da28c8b0` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L142)

---

#### `Unnamed Snippet`

~~~
// Dynamic group authorization with multiple groups
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  groups: a.string().array(),
})
.authorization((allow) => [allow.groupsDefinedIn("groups")]),
});

~~~

| | |
| -- | -- |
| Hash | `bf7dbedd18de6bb0` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L499)

---

#### `Unnamed Snippet`

~~~
// Dynamic group authorization with a single group
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  group: a.string(),
})
.authorization((allow) => [allow.groupDefinedIn("group")]),
});

~~~

| | |
| -- | -- |
| Hash | `d1d464b81fe796a2` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L519)

---

[<- Back to index](../../../../../../docs-pages.md)
