[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/query-data/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// list all items
const { data: todos, errors } = await client.models.Todo.list();

// get a specific item
const { data: todo, errors } = await client.models.Todo.get({
  id: "...",
});

~~~

| | |
| -- | -- |
| Hash | `d802e473c55f60ff` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L92)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: todos } = await client.models.Todo.list({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `27083fbf217f4594` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L346)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
content: {
  beginsWith: "hello",
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `b7a13dcc42cc0f2b` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L145)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
or: [
  {
    priority: { eq: "1" },
  },
  {
    priority: { eq: "2" },
  },
],
  },
});

~~~

| | |
| -- | -- |
| Hash | `805e7a16e0b5b803` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L182)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const {
  data: todos,
  nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
  errors,
} = await client.models.Todo.list({
  limit: 100, // default value is 100
  nextToken: "eyJ2ZXJzaW9uejE1a2...", // previous nextToken
});

~~~

| | |
| -- | -- |
| Hash | `6cac5a92233f7f71` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L225)

---

#### `Unnamed Snippet`

~~~
import * as React from "react";
import { Pagination } from "@aws-amplify/ui-react";

export const PaginationHasMorePagesExample = () => {
  const [pageTokens, setPageTokens] = React.useState([null]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {
if (hasMorePages && currentPageIndex === pageTokens.length) {
  const { data: todos, nextToken } = await client.models.Todo.list({
    nextToken: pageTokens[pageTokens.length - 1],
  });

  if (!nextToken) {
    setHasMorePages(false);
  }

  setPageTokens([...pageTokens, nextToken]);
}

setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
<Pagination
  currentPage={currentPageIndex}
  totalPages={pageTokens.length}
  hasMorePages={hasMorePages}
  onNext={handleNextPage}
  onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
  onChange={(pageIndex) => setCurrentPageIndex(pageIndex)}
/>
  );
};

~~~

| | |
| -- | -- |
| Hash | `af99c7c3ce818ba9` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L225)

---

#### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blogWithSubsetOfData, errors } = await client.models.Blog.get(
  { id: blog.id },
  {
selectionSet: ["author.email", "posts.*"],
  },
);

~~~

| | |
| -- | -- |
| Hash | `c5a9d7a5cdc10664` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L354)

---

#### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";

type Post = Schema["Post"]["type"];

const [posts, setPosts] = useState<Post[]>([]);

~~~

| | |
| -- | -- |
| Hash | `4c106be9c8e3749e` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L401)

---

#### `Unnamed Snippet`

~~~
import type { SelectionSet } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const selectionSet = ["content", "blog.author.*", "comments.*"] as const;
type PostWithComments = SelectionSet<
  Schema["Post"]["type"],
  typeof selectionSet
>;

// ...
const [posts, setPosts] = useState<PostWithComments[]>([]);

const fetchPosts = async () => {
  const { data: postsWithComments } = await client.models.Post.list({
selectionSet,
  });
  setPosts(postsWithComments);
};

~~~

| | |
| -- | -- |
| Hash | `594df1fdc5fc0b68` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/read-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/read-data.ts#L455)

---

#### `Unnamed Snippet`

~~~
const promise = client.models.Todo.list();
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
...

// To cancel the above request
client.cancel(promise, "my message for cancellation");

~~~

| | |
| -- | -- |
| Hash | `e84aa109193880d4` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/error-handling.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/error-handling.ts#L746)

---

#### `Unnamed Snippet`

~~~
async function makeAPICall() {
  return client.models.Todo.list();
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, "my error message");

~~~

| | |
| -- | -- |
| Hash | `5b7af56d08383ae9` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/error-handling.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/error-handling.ts#L746)

---

[<- Back to index](../../../../../docs-pages.md)
