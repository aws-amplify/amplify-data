[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/

Coverage: 0.0%

#### `Unnamed Snippet`

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

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};

~~~

| | |
| -- | -- |
| Hash | `074ff31ac8fcd4d4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
const client = generateClient();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};

~~~

| | |
| -- | -- |
| Hash | `ab5b1a4b0db8b096` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `214c31dd2206bfca` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "userPool",
});

~~~

| | |
| -- | -- |
| Hash | `92f1e6d948bb2f1e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `b7b5ef648a737b54` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "oidc",
});

~~~

| | |
| -- | -- |
| Hash | `2fcbfbd338e2b642` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const getAuthToken = () => "myAuthToken";
const lambdaAuthToken = getAuthToken();

const client = generateClient<Schema>({
  authMode: "lambda",
  authToken: lambdaAuthToken,
});

~~~

| | |
| -- | -- |
| Hash | `bd051f6474d8be69` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `f836602769f99712` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "userPool",
});

~~~

| | |
| -- | -- |
| Hash | `de5a11b2edead530` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `7f181ae9db749fd0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "oidc",
});

~~~

| | |
| -- | -- |
| Hash | `274e791981c46dd6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const getAuthToken = () => "myAuthToken";
const lambdaAuthToken = getAuthToken();

const { data: todos, errors } = await client.models.Todo.list({
  authMode: "lambda",
  authToken: lambdaAuthToken,
});

~~~

| | |
| -- | -- |
| Hash | `ac808f107270b120` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
  headers: {
"My-Custom-Header": "my value",
  },
});

~~~

| | |
| -- | -- |
| Hash | `486ccc64ea1f256b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blog, errors } = await client.models.Blog.get(
  { id: "myBlogId" },
  {
headers: {
  "My-Custom-Header": "my value",
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `3d9cf7dde513d92c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
  headers: async (requestOptions) => {
console.log(requestOptions);
/* The request options allow you to customize your headers based on the request options such
   as http method, headers, request URI, and query string. These options are typically used
   to create a request signature.
{
  method: '...',
  headers: { },
  uri: '/',
  queryString: ""
}
*/
return {
  "My-Custom-Header": "my value",
};
  },
});

~~~

| | |
| -- | -- |
| Hash | `139f78578144d99f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const res = await client.models.Blog.get(
  { id: "myBlogId" },
  {
headers: async (requestOptions) => {
  console.log(requestOptions);
  /* The request options allow you to customize your headers based on the request options such
    as http method, headers, request URI, and query string. These options are typically used
    to create a request signature.
  {
    method: '...',
    headers: { },
    uri: '/',
    queryString: ""
  }
  */
  return {
    "My-Custom-Header": "my value",
  };
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `6d4cd9b69d769785` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
