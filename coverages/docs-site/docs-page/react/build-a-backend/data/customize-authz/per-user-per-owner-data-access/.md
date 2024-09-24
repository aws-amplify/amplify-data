[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
// The "owner" of a Todo is allowed to create, read, update, and delete their own todos
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `c235455cb03a5496` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
// The "owner" of a Todo record is only allowed to create, read, and update it.
// The "owner" of a Todo record is denied to delete it.
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.owner().to(["create", "read", "update"])]),
});

~~~

| | |
| -- | -- |
| Hash | `4d68a311e1ae39ec` |
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
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `b73cd93b7f81ba2a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  owner: a
    .string()
    .authorization((allow) => [allow.owner().to(["read", "delete"])]),
})
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `82938d1493598d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  author: a.string(), // record owner information now stored in "author" field
})
.authorization((allow) => [allow.ownerDefinedIn("author")]),
});

~~~

| | |
| -- | -- |
| Hash | `f726c21f04df30d2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
