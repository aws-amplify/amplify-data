[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
// STEP 1
// Indicate which models / fields should use a custom authorization rule
.authorization((allow) => [allow.custom()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "lambda",
// STEP 2
// Pass in the function to be used for a custom authorization rule
lambdaAuthorizationMode: {
  function: defineFunction({
    entry: "./custom-authorizer.ts",
  }),
  // (Optional) STEP 3
  // Configure the token's time to live
  timeToLiveInSeconds: 300,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `9cc76371f93ceb4b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "lambda",
  },
);

~~~

| | |
| -- | -- |
| Hash | `f1c468dfd69b0c4a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// amplify/data/custom-authorizer.ts

// This is sample code. Update this to suite your needs
import type { AppSyncAuthorizerHandler } from "aws-lambda"; // types imported from @types/aws-lambda

type ResolverContext = {
  userid: string;
  info: string;
  more_info: string;
};

export const handler: AppSyncAuthorizerHandler<ResolverContext> = async (
  event,
) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
authorizationToken,
requestContext: { apiId, accountId },
  } = event;
  const response = {
isAuthorized: authorizationToken === "custom-authorized",
resolverContext: {
  // eslint-disable-next-line spellcheck/spell-checker
  userid: "user-id",
  info: "contextual information A",
  more_info: "contextual information B",
},
deniedFields: [
  `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
  `Mutation.createEvent`,
],
ttlOverride: 300,
  };
  console.log(`RESPONSE: ${JSON.stringify(response, null, 2)}`);
  return response;
};

~~~

| | |
| -- | -- |
| Hash | `7979ac575fb5c105` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
{
"authorizationToken": "ExampleAuthToken123123123", # Authorization token specified by client
"requestContext": {
    "apiId": "aaaaaa123123123example123", # AppSync API ID
    "accountId": "111122223333", # AWS Account ID
    "requestId": "f4081827-1111-4444-5555-5cf4695f339f",
    "queryString": "mutation CreateEvent {...}\n\nquery MyQuery {...}\n", # GraphQL query
    "operationName": "MyQuery", # GraphQL operation name
    "variables": {} # any additional variables supplied to the operation
}
}

~~~

| | |
| -- | -- |
| Hash | `bf33ce519615bf57` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
{
  // required
  "isAuthorized": true, // if "false" then an UnauthorizedException is raised, access is denied
  "resolverContext": { "banana": "very yellow" }, // JSON object visible as $ctx.identity.resolverContext in VTL resolver templates

  // optional
  "deniedFields": ["TypeName.FieldName"], // Forces the fields to "null" when returned to the client
  "ttlOverride": 10 // The number of seconds that the response should be cached for. Overrides default specified in "amplify update api"
}

~~~

| | |
| -- | -- |
| Hash | `1638c78777796c97` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
