[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Message type that's used for this PubSub sample
  Message: a.customType({
content: a.string().required(),
channelName: a.string().required(),
  }),

  // Message publish mutation
  publish: a
.mutation()
.arguments({
  channelName: a.string().required(),
  content: a.string().required(),
})
.returns(a.ref("Message"))
.handler(a.handler.custom({ entry: "./publish.js" }))
.authorization((allow) => [allow.publicApiKey()]),

  // Subscribe to incoming messages
  receive: a
.subscription()
// subscribes to the 'publish' mutation
.for(a.ref("publish"))
// subscription handler to set custom filters
.handler(a.handler.custom({ entry: "./receive.js" }))
// authorization rules as to who can subscribe to the data
.authorization((allow) => [allow.publicApiKey()]),

  // A data model to manage channels
  Channel: a
.model({
  name: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `3f22d1115fdd0bd7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/publish.js`

~~~
// This handler simply passes through the arguments of the mutation through as the result
export function request() {
  return {};
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  return ctx.args;
}

~~~

| | |
| -- | -- |
| Hash | `a8da17bf52779423` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/receive.js`

~~~
export function request() {
  return {};
}

export const response = (ctx) => {
  return ctx.result;
};

~~~

| | |
| -- | -- |
| Hash | `0c92d3e251c14dd8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const sub = client.subscriptions.receive().subscribe({
  next: (event) => {
console.log(event);
  },
});

~~~

| | |
| -- | -- |
| Hash | `71c0932ed659436e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
client.mutations.publish({
  channelName: "world",
  content: "My first message!",
});

~~~

| | |
| -- | -- |
| Hash | `13b68e9e7816b879` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `18118a741cc48da5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Channel: a
.model({
  name: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),

  Message: a.customType({
content: a.string().required(),
channelName: a.string().required(),
  }),

  publish: a
.mutation()
.arguments({
  channelName: a.string().required(),
  content: a.string().required(),
})
.returns(a.ref("Message"))
.handler(a.handler.custom({ entry: "./publish.js" }))
.authorization((allow) => [allow.publicApiKey()]),

  receive: a
.subscription()
.for(a.ref("publish"))
.arguments({ namePrefix: a.string() })
.handler(a.handler.custom({ entry: "./receive.js" }))
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `3a761e0e4260590a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { util, extensions } from "@aws-appsync/utils";

// Subscription handlers must return a `null` payload on the request
export function request() {
  return { payload: null };
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  const filter = {
channelName: {
  beginsWith: ctx.args.namePrefix,
},
  };

  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));

  return null;
}

~~~

| | |
| -- | -- |
| Hash | `86525827632442c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
