[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/mutate-data/

Coverage: 0.0%

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create({
  content: "My new todo",
  isDone: true,
});

~~~

| | |
| -- | -- |
| Hash | `526c23ab1a272548` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const todo = {
  id: "some_id",
  content: "Updated content",
};

const { data: updatedTodo, errors } = await client.models.Todo.update(todo);

~~~

| | |
| -- | -- |
| Hash | `704cbd0a4efed24a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const toBeDeletedTodo = {
  id: "123123213",
};

const { data: deletedTodo, errors } =
  await client.models.Todo.delete(toBeDeletedTodo);

~~~

| | |
| -- | -- |
| Hash | `a0aebe5c8b5a2797` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
isDone: true,
  },
  {
authMode: "apiKey",
  },
);

~~~

| | |
| -- | -- |
| Hash | `4729d3f005811c37` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const promise = client.models.Todo.create({ content: "New Todo " });
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
console.log(error.message); // "my message for cancellation"
// handle user cancellation logic
  }
}

//...

// To cancel the above request
client.cancel(promise, "my message for cancellation");

~~~

| | |
| -- | -- |
| Hash | `7788520a09a949aa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
async function makeAPICall() {
  return client.models.Todo.create({ content: "New Todo" });
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, "my error message");

~~~

| | |
| -- | -- |
| Hash | `93ed69df71688b6d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
