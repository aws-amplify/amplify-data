[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/

Coverage: 0.0%

#### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: "say-hello",
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: "./handler.ts",
});

~~~

| | |
| -- | -- |
| Hash | `7f6cf64d79fd0683` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/handler.ts`

~~~
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  // your function code goes here
  return "Hello, World!";
};

~~~

| | |
| -- | -- |
| Hash | `937259d927dccabc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { sayHello } from "./functions/say-hello/resource";

defineBackend({
  sayHello,
});

~~~

| | |
| -- | -- |
| Hash | `1ac3057102a272e1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";

const schema = a.schema({
  sayHello: a
.query()
.arguments({
  name: a.string(),
})
.returns(a.string())
.handler(a.handler.function(sayHello)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "iam",
  },
});

~~~

| | |
| -- | -- |
| Hash | `ffcef2e09d7f1abe` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/handler.ts`

~~~
import type { Schema } from "../../data/resource";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments;
  // return typed from `.returns()`
  return `Hello, ${name}!`;
};

~~~

| | |
| -- | -- |
| Hash | `8f38a781d49b259d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/main.ts`

~~~
import type { Schema } from "./amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

client.queries.sayHello({
  name: "Amplify",
});

~~~

| | |
| -- | -- |
| Hash | `fde03d3112494569` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
