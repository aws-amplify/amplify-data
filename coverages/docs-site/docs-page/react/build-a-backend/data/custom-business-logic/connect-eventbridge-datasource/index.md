[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/

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
  OrderStatus: a.enum(["OrderPending", "OrderShipped", "OrderDelivered"]),
  OrderStatusChange: a.customType({
orderId: a.id().required(),
status: a.ref("OrderStatus").required(),
message: a.string().required(),
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
| Hash | `63f7e87bfcda28ee` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { aws_events } from "aws-cdk-lib";
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
});

// Create a new stack for the EventBridge data source
const eventStack = backend.createStack("MyExternalDataSources");

// Reference or create an EventBridge EventBus
const eventBus = aws_events.EventBus.fromEventBusName(
  eventStack,
  "MyEventBus",
  "default",
);

// Add the EventBridge data source
backend.data.addEventBridgeDataSource("MyEventBridgeDataSource", eventBus);

// Create a policy statement to allow invoking the AppSync API's mutations
const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ["appsync:GraphQL"],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Mutation/*`],
});

// Create a role for the EventBus to assume
const eventBusRole = new Role(eventStack, "AppSyncInvokeRole", {
  assumedBy: new ServicePrincipal("events.amazonaws.com"),
  inlinePolicies: {
PolicyStatement: new PolicyDocument({
  statements: [policyStatement],
}),
  },
});

// Create an EventBridge rule to route events to the AppSync API
const rule = new aws_events.CfnRule(eventStack, "MyOrderRule", {
  eventBusName: eventBus.eventBusName,
  name: "broadcastOrderStatusChange",
  eventPattern: {
source: ["amplify.orders"],
/* The shape of the event pattern must match EventBridge's event message structure.
So, this field must be spelled as "detail-type". Otherwise, events will not trigger the rule.

https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html
*/
["detail-type"]: ["OrderStatusChange"],
detail: {
  orderId: [{ exists: true }],
  status: ["PENDING", "SHIPPED", "DELIVERED"],
  message: [{ exists: true }],
},
  },
  targets: [
{
  id: "orderStatusChangeReceiver",
  arn: backend.data.resources.cfnResources.cfnGraphqlApi
    .attrGraphQlEndpointArn,
  roleArn: eventBusRole.roleArn,
  appSyncParameters: {
    graphQlOperation: `
    mutation PublishOrderFromEventBridge(
$orderId: String!
$status: String!
$message: String!
    ) {
publishOrderFromEventBridge(orderId: $orderId, status: $status, message: $message) {
  orderId
  status
  message
}
    }`,
  },
  inputTransformer: {
    inputPathsMap: {
orderId: "$.detail.orderId",
status: "$.detail.status",
message: "$.detail.message",
    },
    inputTemplate: JSON.stringify({
orderId: "<orderId>",
status: "<status>",
message: "<message>",
    }),
  },
},
  ],
});

~~~

| | |
| -- | -- |
| Hash | `e9b07c00017b6864` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // ...
  OrderStatus: a.enum(["OrderPending", "OrderShipped", "OrderDelivered"]),
  OrderStatusChange: a.customType({
orderId: a.id().required(),
status: a.ref("OrderStatus").required(),
message: a.string().required(),
  }),
  publishOrderToEventBridge: a
.mutation()
.arguments({
  orderId: a.id().required(),
  status: a.string().required(),
  message: a.string().required(),
})
.returns(a.ref("OrderStatusChange"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "EventBridgeDataSource",
    entry: "./publishOrderToEventBridge.js",
  }),
),
  publishOrderFromEventBridge: a
.mutation()
.arguments({
  orderId: a.id().required(),
  status: a.string().required(),
  message: a.string().required(),
})
.returns(a.ref("OrderStatusChange"))
.authorization((allow) => [allow.publicApiKey(), allow.guest()])
.handler(
  a.handler.custom({
    entry: "./publishOrderFromEventBridge.js",
  }),
),
  onOrderFromEventBridge: a
.subscription()
.for(a.ref("publishOrderFromEventBridge"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./onOrderFromEventBridge.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  name: "MyLibrary",
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
| Hash | `8f8869419729e9d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/onOrderStatusChange.js`

~~~
export function request(ctx) {
  return {
payload: {},
  };
}

export function response(ctx) {}

~~~

| | |
| -- | -- |
| Hash | `d28c7ba9ea568301` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/publishOrderToEventBridge.js`

~~~
export function request(ctx) {
  return {
operation: "PutEvents",
events: [
  {
    source: "amplify.orders",
    ["detail-type"]: "OrderStatusChange",
    detail: { ...ctx.args },
  },
],
  };
}

export function response(ctx) {
  return ctx.args;
}

~~~

| | |
| -- | -- |
| Hash | `bee1d61c5fc55b23` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/publishOrderFromEventBridge.js`

~~~
export function request(ctx) {
  return {
payload: ctx.arguments,
  };
}

export function response(ctx) {
  return ctx.arguments;
}

~~~

| | |
| -- | -- |
| Hash | `c52b82246c57ac1f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
await client.mutations.publishOrderToEventBridge({
  orderId: "12345",
  status: "SHIPPED",
  message: "Order has been shipped",
});

~~~

| | |
| -- | -- |
| Hash | `7b0f27cf36fd005c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
// Subscribe to the mutations triggered by the EventBridge rule
const sub = client.subscriptions.onOrderStatusChange().subscribe({
  next: (data) => {
console.log(data);
  },
});

//...

// Clean up subscription
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `3c38c8153f1bba58` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
