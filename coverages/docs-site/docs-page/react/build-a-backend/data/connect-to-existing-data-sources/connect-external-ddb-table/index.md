[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  Post: a.customType({
id: a.id().required(),
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
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
| Hash | `a19235ddde928883` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { aws_dynamodb } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
});

const externalDataSourcesStack = backend.createStack("MyExternalDataSources");

const externalTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "MyExternalPostTable",
  "PostTable",
);

backend.data.addDynamoDbDataSource(
  "ExternalPostTableDataSource",
  externalTable,
);

~~~

| | |
| -- | -- |
| Hash | `162d8b8ed28fe6ce` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  addPost: a
.mutation()
.arguments({
  id: a.id(),
  author: a.string().required(),
  title: a.string(),
  content: a.string(),
  url: a.string(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./addPost.js",
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
| Hash | `82af3812a4845b9f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  getPost: a
.query()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./getPost.js",
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
| Hash | `cc413eca4d74c0c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  updatePost: a
.mutation()
.arguments({
  id: a.id().required(),
  author: a.string(),
  title: a.string(),
  content: a.string(),
  url: a.string(),
  expectedVersion: a.integer().required(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./updatePost.js",
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
| Hash | `514c919cbbf2741d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  deletePost: a
.mutation()
.arguments({ id: a.id().required(), expectedVersion: a.integer() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./deletePost.js",
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
| Hash | `7511ba489422cbaa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/addPost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const item = { ...ctx.arguments, ups: 1, downs: 0, version: 1 };
  const key = { id: ctx.args.id ?? util.autoId() };
  return ddb.put({ key, item });
}

export function response(ctx) {
  return ctx.result;
}

~~~

| | |
| -- | -- |
| Hash | `78d0e40a38210ca2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/getPost.js`

~~~
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return ddb.get({ key: { id: ctx.args.id } });
}

export const response = (ctx) => ctx.result;

~~~

| | |
| -- | -- |
| Hash | `852c18d3beb6e876` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/updatePost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { id, expectedVersion, ...rest } = ctx.args;
  const values = Object.entries(rest).reduce((obj, [key, value]) => {
obj[key] = value ?? ddb.operations.remove();
return obj;
  }, {});

  return ddb.update({
key: { id },
condition: { version: { eq: expectedVersion } },
update: { ...values, version: ddb.operations.increment(1) },
  });
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
util.appendError(error.message, error.type);
  }
  return result;
}

~~~

| | |
| -- | -- |
| Hash | `01edcc7a4e9a3ad1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/deletePost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  let condition = null;
  if (ctx.args.expectedVersion) {
condition = {
  or: [
    { id: { attributeExists: false } },
    { version: { eq: ctx.args.expectedVersion } },
  ],
};
  }
  return ddb.remove({ key: { id: ctx.args.id }, condition });
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
util.appendError(error.message, error.type);
  }
  return result;
}

~~~

| | |
| -- | -- |
| Hash | `333eae9033374c42` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
const { data, errors } = await client.mutations.addPost({
  title: "My Post",
  content: "My Content",
  author: "Chris",
});

~~~

| | |
| -- | -- |
| Hash | `e2421a40800acfac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
const { data, errors } = await client.queries.getPost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `8c001c6c1cc91d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
const { data, errors } = await client.mutations.updatePost({
  id: "<post-id>",
  title: "An Updated Post",
  expectedVersion: 1,
});

~~~

| | |
| -- | -- |
| Hash | `f5328ca32d825139` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
const { data, errors } = await client.mutations.deletePost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `0eefd1ef7277ba0d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
export function request(ctx) {
  const { foo, bar } = ctx.args;
  return {
operation: "GetItem",
key: util.dynamodb.toMapValues({ foo, bar }),
consistentRead: true,
  };
}

~~~

| | |
| -- | -- |
| Hash | `c2ad4a885704896a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { foo, bar, ...values } = ctx.args;
  return {
operation: "PutItem",
key: util.dynamodb.toMapValues({ foo, bar }),
attributeValues: util.dynamodb.toMapValues(values),
  };
}

~~~

| | |
| -- | -- |
| Hash | `ac99ec3cff825ff6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { id } = ctx.args;
  return {
operation: "UpdateItem",
key: util.dynamodb.toMapValues({ id }),
update: {
  expression: "ADD #voteField :plusOne, version :plusOne",
  expressionNames: { "#voteField": "upvotes" },
  expressionValues: { ":plusOne": { N: 1 } },
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `4bab2c16fe96a51a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  return {
operation: "DeleteItem",
key: util.dynamodb.toMapValues({ id: ctx.args.id }),
  };
}

~~~

| | |
| -- | -- |
| Hash | `6f631e2f7615de93` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { owner } = ctx.args;
  return {
operation: "Query",
query: {
  expression: "ownerId = :ownerId",
  expressionValues: util.dynamodb.toMapValues({ ":ownerId": owner }),
},
index: "owner-index",
  };
}

~~~

| | |
| -- | -- |
| Hash | `aa9fb179a14c1f5a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
export function request(ctx) {
  return { operation: "Scan" };
}

~~~

| | |
| -- | -- |
| Hash | `e2c67cc113847600` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
export function request(ctx) {
  const { nextToken, lastSync } = ctx.args;
  return { operation: "Sync", limit: 100, nextToken, lastSync };
}

~~~

| | |
| -- | -- |
| Hash | `87f694f7341ed37b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "BatchGetItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId })],
  posts: [util.dynamodb.toMapValues({ authorId, postId })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `332fbbbfedb89bba` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "BatchDeleteItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId })],
  posts: [util.dynamodb.toMapValues({ authorId, postId })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `f0a5a683fa5c31f7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId, name, title } = ctx.args;
  return {
operation: "BatchPutItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId, name })],
  posts: [util.dynamodb.toMapValues({ authorId, postId, title })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `5b35643d0deead1d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "TransactGetItems",
transactItems: [
  {
    table: "posts",
    key: util.dynamodb.toMapValues({ postId }),
  },
  {
    table: "authors",
    key: util.dynamodb.toMapValues({ authorId }),
  },
],
  };
}

~~~

| | |
| -- | -- |
| Hash | `5d3066384580c8a5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId, title, description, oldTitle, authorName } =
ctx.args;
  return {
operation: "TransactWriteItems",
transactItems: [
  {
    table: "posts",
    operation: "PutItem",
    key: util.dynamodb.toMapValues({ postId }),
    attributeValues: util.dynamodb.toMapValues({ title, description }),
    condition: util.transform.toDynamoDBConditionExpression({
title: { eq: oldTitle },
    }),
  },
  {
    table: "authors",
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({ authorId }),
    update: {
expression: "SET authorName = :name",
expressionValues: util.dynamodb.toMapValues({ ":name": authorName }),
    },
  },
],
  };
}

~~~

| | |
| -- | -- |
| Hash | `f27b22d02f00052c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
