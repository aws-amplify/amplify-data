[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/

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
title: a.string(),
content: a.string(),
author: a.string().required(),
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
| Hash | `d4a9edbd787c42a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

const httpDataSource = backend.data.addHttpDataSource(
  "HttpDataSource",
  "https://www.example.com",
);

~~~

| | |
| -- | -- |
| Hash | `61d95d9d8b84721a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  addPost: a
.mutation()
.arguments({
  title: a.string(),
  content: a.string(),
  author: a.string().required(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
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
| Hash | `51f55c11c111f5f6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  getPost: a
.query()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
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
| Hash | `69971cfbd80f236f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  updatePost: a
.mutation()
.arguments({
  id: a.id().required(),
  title: a.string(),
  content: a.string(),
  author: a.string(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
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
| Hash | `ac60f58446239a86` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  deletePost: a
.mutation()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
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
| Hash | `14260040162c808a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/addPost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "POST",
resourcePath: "/post",
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    title: ctx.arguments.title,
    content: ctx.arguments.content,
    author: ctx.arguments.author,
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `3f15393d6b74ef97` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/getPost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "GET",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `70f5446fe7fb2a8b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/updatePost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "POST",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    title: ctx.arguments.title,
    content: ctx.arguments.content,
    author: ctx.arguments.author,
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `047316efba4e5444` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/deletePost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "DELETE",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `a3d8554efda4da61` |
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
});

~~~

| | |
| -- | -- |
| Hash | `dcf98fc5c5e0514b` |
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

[<- Back to index](../../../../../../docs-pages.md)
