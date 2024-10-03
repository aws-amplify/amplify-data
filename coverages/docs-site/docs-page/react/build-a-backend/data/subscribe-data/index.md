[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/

Coverage: 55.6%

#### `Unnamed Snippet`

~~~
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

type Todo = Schema["Todo"]["type"];

const client = generateClient<Schema>();

export default function MyComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
const sub = client.models.Todo.observeQuery().subscribe({
  next: ({ items, isSynced }) => {
    setTodos([...items]);
  },
});
return () => sub.unsubscribe();
  }, []);

  return (
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.content}</li>
  ))}
</ul>
  );
}

~~~

| | |
| -- | -- |
| Hash | `19bebafef196be7c` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/subscribe-to-real-time-events.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/subscribe-to-real-time-events.ts#L61)

---

#### `Unnamed Snippet`

~~~
// Defining your selection set `as const` ensures the types
// propagate through to the response objects.
const selectionSet = ['title', 'author', 'posts.*'] as const;

const sub = client.models.Blog.observeQuery(
  filter: { id: { eq: 'blog-id' } },
  selectionSet: [...selectionSet]
).subscribe({
  next(data) {
handle(data.items)
  }
});

// The update uses the same selection set, ensuring all the
// required fields are provided to the subscriber.
const { data } = await client.models.Blog.update({
  id: 'blog-id',
  name: 'Updated Name'
}, {
  selectionSet: [...selectionSet]
});

~~~

| | |
| -- | -- |
| Hash | `ceec33b4e66930a2` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-selection-set.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-selection-set.ts#L444)

---

#### `Unnamed Snippet`

~~~
// Notice how we're fetching a few `Blog` details, but mostly using
// the selection set to grab all the related posts.
const selectionSet = ['title', 'author', 'posts.*'] as const;

const sub = client.models.Blog.observeQuery(
  filter: { id: { eq: 'blog-id' } },
  selectionSet: [...selectionSet]
).subscribe({
  next(data) {
handle(data.items)
  }
});

~~~

| | |
| -- | -- |
| Hash | `211161dff2eb4646` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-selection-set.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-selection-set.ts#L444)

---

#### `Unnamed Snippet`

~~~
async function addPostToBlog(
  post: Schema["Post"]["createType"],
  blog: Schema["Blog"]["type"],
) {
  // Create the post first.
  await client.models.Post.create({
...post,
blogId: blog.id,
  });

  // "Touch" the blog, notifying subscribers to re-render.
  await client.models.Blog.update(
{
  id: blog.id,
},
{
  // Remember to include the selection set if the subscription
  // is looking for related-model fields!
  selectionSet: [...selectionSet],
},
  );
}

~~~

| | |
| -- | -- |
| Hash | `92b382c0ac2298ec` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-selection-set.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-selection-set.ts#L444)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

// Subscribe to creation of Todo
const createSub = client.models.Todo.onCreate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to update of Todo
const updateSub = client.models.Todo.onUpdate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to deletion of Todo
const deleteSub = client.models.Todo.onDelete().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Stop receiving data updates from the subscription
createSub.unsubscribe();
updateSub.unsubscribe();
deleteSub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `837a78504eebfe1e` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-selection-set.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-selection-set.ts#L289)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const sub = client.models.Todo.onCreate({
  filter: {
content: {
  contains: "groceries",
},
  },
}).subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

~~~

| | |
| -- | -- |
| Hash | `dd37adfa68dc80a8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { CONNECTION_STATE_CHANGE, ConnectionState } from "aws-amplify/data";
import { Hub } from "aws-amplify/utils";

Hub.listen("api", (data: any) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
const connectionState = payload.data.connectionState as ConnectionState;
console.log(connectionState);
  }
});

~~~

| | |
| -- | -- |
| Hash | `3d50d3d345883f3f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient, CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data'
import { Hub } from 'aws-amplify/utils'
import { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>()

const fetchRecentData = () => {
  const { data: allTodos } = await client.models.Todo.list();
}

let priorConnectionState: ConnectionState;

Hub.listen("api", (data: any) => {
  const { payload } = data;
  if (
payload.event === CONNECTION_STATE_CHANGE
  ) {

if (priorConnectionState === ConnectionState.Connecting && payload.data.connectionState === ConnectionState.Connected) {
  fetchRecentData();
}
priorConnectionState = payload.data.connectionState;
  }
});

const createSub = client.models.Todo.onCreate().subscribe({
  next: payload => // Process incoming messages
});

const updateSub = client.models.Todo.onUpdate().subscribe({
  next: payload => // Process incoming messages
});

const deleteSub = client.models.Todo.onDelete().subscribe({
  next: payload => // Process incoming messages
});

const cleanupSubscriptions = () => {
  createSub.unsubscribe();
  updateSub.unsubscribe();
  deleteSub.unsubscribe();
}

~~~

| | |
| -- | -- |
| Hash | `ccefe4830defbe18` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// Stop receiving data updates from the subscription
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `982a132bf936968c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
