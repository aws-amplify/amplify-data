[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/

Coverage: 0.0%

#### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  environment: {
NAME: "World",
  },
});

~~~

| | |
| -- | -- |
| Hash | `2c96b809a658d6fc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/resource.ts`

~~~
export const sayHello = defineFunction({
  environment: {
NAME: "World",
API_ENDPOINT: process.env.API_ENDPOINT,
  },
});

~~~

| | |
| -- | -- |
| Hash | `fa6a5002ce0303b1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello"; // the import is '$amplify/env/<function-name>'

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `d8864be05ad1014e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/tsconfig.json`

~~~
{
  "compilerOptions": {
"paths": {
  "$amplify/*": ["../.amplify/generated/*"]
}
  }
}

~~~

| | |
| -- | -- |
| Hash | `5763fd6929aa55fe` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  environment: {
NAME: "World",
  },
});

~~~

| | |
| -- | -- |
| Hash | `c2c60dde955a48c4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
.amplify/generated/env/say-hello.ts

~~~

| | |
| -- | -- |
| Hash | `0db8868b6b6b4159` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello";

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `2b26fc1940aea483` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  environment: {
NAME: "World",
API_ENDPOINT: process.env.API_ENDPOINT,
API_KEY: secret("MY_API_KEY"), // this assumes you created a secret named "MY_API_KEY"
  },
});

~~~

| | |
| -- | -- |
| Hash | `ca8b3f2fb9c7f8b7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello";

export const handler = async (event) => {
  const request = new Request(env.API_ENDPOINT, {
headers: {
  // this is the value of secret named "MY_API_KEY"
  Authorization: `Bearer ${env.API_KEY}`,
},
  });
  // ...
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `78c76e0bca2d358d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
