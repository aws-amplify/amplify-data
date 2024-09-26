[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  owners: a.string().array(),
})
.authorization((allow) => [allow.ownersDefinedIn("owners")]),
});

~~~

| | |
| -- | -- |
| Hash | `c11708f5a31a500d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Create a record with current user as first owner
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
| Hash | `a4e33f3ee41a3d19` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
await client.models.Todo.update(
  {
id: newTodo.id,
owners: [...(newTodo.owners as string[]), otherUserId],
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `27d103ec9928e5ee` |
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
  authors: a.string().array(), // record owner information now stored in "authors" field
})
.authorization((allow) => [allow.ownersDefinedIn("authors")]),
});

~~~

| | |
| -- | -- |
| Hash | `e980f738c085ac2f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
