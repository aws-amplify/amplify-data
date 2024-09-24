[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/

Coverage: 0.0%

#### `Terminal`

~~~
npm add --save-dev @aws-sdk/client-cognito-identity-provider @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `0a23d15d6d404548` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/post-confirmation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  // optionally define an environment variable for your group name
  environment: {
GROUP_NAME: "EVERYONE",
  },
});

~~~

| | |
| -- | -- |
| Hash | `313f2159dfd10f36` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  groups: ["EVERYONE"],
  triggers: {
postConfirmation,
  },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
});

~~~

| | |
| -- | -- |
| Hash | `a33e0d803731568b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/post-confirmation/handler.ts`

~~~
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { env } from "$amplify/env/post-confirmation";

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const command = new AdminAddUserToGroupCommand({
GroupName: env.GROUP_NAME,
Username: event.userName,
UserPoolId: event.userPoolId,
  });
  const response = await client.send(command);
  console.log("processed", response.$metadata.requestId);
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `c6ed8737a194d963` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
