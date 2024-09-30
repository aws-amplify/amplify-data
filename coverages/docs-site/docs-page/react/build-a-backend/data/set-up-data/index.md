[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/set-up-data/

Coverage: 14.3%

#### `amplify/data/resource.ts`

~~~
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  isDone: a.boolean(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});

~~~

| | |
| -- | -- |
| Hash | `7a897658524a2d0b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/common.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#L7)

---

#### `Terminal`

~~~
npm add aws-amplify

~~~

| | |
| -- | -- |
| Hash | `1759cbd7cc5e4599` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/TodoList.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `2f36362b325fd6f9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/TodoList.tsx`

~~~
import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  const fetchTodos = async () => {
const { data: items, errors } = await client.models.Todo.list();
setTodos(items);
  };

  useEffect(() => {
fetchTodos();
  }, []);

  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});

fetchTodos();
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
  <ul>
    {todos.map(({ id, content }) => (
<li key={id}>{content}</li>
    ))}
  </ul>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c18fb667c9efe229` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
const sub = client.models.Todo.observeQuery().subscribe({
  next: ({ items }) => {
    setTodos([...items]);
  },
});

return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});
// no more manual refetchTodos required!
// - fetchTodos()
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
  <ul>
    {todos.map(({ id, content }) => (
<li key={id}>{content}</li>
    ))}
  </ul>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c4e9900baed037f1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
