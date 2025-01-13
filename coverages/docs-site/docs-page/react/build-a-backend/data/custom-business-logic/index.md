[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/

Coverage: 81.8%

#### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 1. Define your return type as a custom type
  EchoResponse: a.customType({
content: a.string(),
executionDuration: a.float(),
  }),

  // 2. Define your query with the return type and, optionally, arguments
  echo: a
.query()
// arguments that this query accepts
.arguments({
  content: a.string(),
})
// return type of the query
.returns(a.ref("EchoResponse"))
// only allow signed-in users to call this API
.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `d9c0f0f657dbbe8a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-operations.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-operations.ts#L23)

---

#### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 1. Define your return type as a custom type or model
  Post: a.model({
id: a.id(),
content: a.string(),
likes: a.integer(),
  }),

  // 2. Define your mutation with the return type and, optionally, arguments
  likePost: a
.mutation()
// arguments that this query accepts
.arguments({
  postId: a.string(),
})
// return type of the query
.returns(a.ref("Post"))
// only allow signed-in users to call this API
.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `e394d9c98b1a1f8d` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-operations.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-operations.ts#L23)

---

#### `amplify/data/echo-handler/handler.ts`

~~~
import type { Schema } from "../resource";

export const handler: Schema["echo"]["functionHandler"] = async (
  event,
  context,
) => {
  const start = performance.now();
  return {
content: `Echoing content: ${event.arguments.content}`,
executionDuration: performance.now() - start,
  };
};

~~~

| | |
| -- | -- |
| Hash | `584adc09feb4d383` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/client-schema.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/client-schema.ts#L147)

---

#### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction, // 1.Import "defineFunction" to create new functions
} from "@aws-amplify/backend";

// 2. define a function
const echoHandler = defineFunction({
  entry: "./echo-handler/handler.ts",
});

const schema = a.schema({
  EchoResponse: a.customType({
content: a.string(),
executionDuration: a.float(),
  }),

  echo: a
.query()
.arguments({ content: a.string() })
.returns(a.ref("EchoResponse"))
.authorization((allow) => [allow.publicApiKey()])
// 3. set the function has the handler
.handler(a.handler.function(echoHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `20ac9f34c6a87da3` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/custom-business-logic.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/custom-business-logic.ts#L9)

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  likes: a
    .integer()
    .authorization((allow) => [allow.authenticated().to(["read"])]),
})
.authorization((allow) => [
  allow.owner(),
  allow.authenticated().to(["read"]),
]),

  likePost: a
.mutation()
.arguments({ postId: a.id() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.authenticated()])
.handler(
  a.handler.custom({
    dataSource: a.ref("Post"),
    entry: "./increment-like.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `2d2c115e89269264` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/increment-like.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
operation: "UpdateItem",
key: util.dynamodb.toMapValues({ id: ctx.args.postId }),
update: {
  expression: "ADD likes :plusOne",
  expressionValues: { ":plusOne": { N: 1 } },
},
  };
}

export function response(ctx) {
  return ctx.result;
}

~~~

| | |
| -- | -- |
| Hash | `b8bef9853eb46bd0` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/custom-business-logic.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/custom-business-logic.ts#L14)

---

#### `amplify/backend.ts`

~~~
import * as dynamoDb from "aws-cdk-lib/aws-dynamodb";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

export const backend = defineBackend({
  auth,
  data,
});

const externalDataSourcesStack = backend.createStack("MyExternalDataSources");

const externalTable = dynamoDb.Table.fromTableName(
  externalDataSourcesStack,
  "MyTable",
  "MyExternalTable",
);

backend.data.addDynamoDbDataSource("ExternalTableDataSource", externalTable);

~~~

| | |
| -- | -- |
| Hash | `fedff4bb36109427` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/custom-business-logic.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/custom-business-logic.ts#L19)

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  likes: a
    .integer()
    .authorization((allow) => [allow.authenticated().to(["read"])]),
})
.authorization((allow) => [
  allow.owner(),
  allow.authenticated().to(["read"]),
]),

  likePost: a
.mutation()
.arguments({ postId: a.id() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.authenticated()])
.handler(
  a.handler.custom({
    dataSource: "ExternalTableDataSource",
    entry: "./increment-like.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `37dddc093610e7b1` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/custom-business-logic.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/custom-business-logic.ts#L24)

---

#### `Unnamed Snippet`

~~~
const { data, errors } = await client.queries.echo({
  content: "hello world!!!",
});

~~~

| | |
| -- | -- |
| Hash | `ffefd700b1e323c9` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/custom-operations.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/custom-operations.ts#L145)

---

#### `Unnamed Snippet`

~~~
const { data, errors } = await client.mutations.likePost({
  postId: "hello",
});

~~~

| | |
| -- | -- |
| Hash | `cb7710cc0dc02bd3` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/client-schema.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/client-schema.ts#L103)

---

#### `amplify/data/resource.ts`

~~~
const signUpForNewsletter = defineFunction({
  entry: "./sign-up-for-newsletter/handler.ts",
});

const schema = a.schema({
  someAsyncOperation: a
.mutation()
.arguments({
  email: a.email().required(),
})
.handler(a.handler.function(signUpForNewsletter).async())
.authorization((allow) => allow.guest()),
});

~~~

| | |
| -- | -- |
| Hash | `418f1d6bf659c185` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
