[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/

Coverage: 0.0%

#### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/pre-sign-up/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: "pre-sign-up",
  // optionally define an environment variable for your filter
  environment: {
ALLOW_DOMAIN: "amazon.com",
  },
});

~~~

| | |
| -- | -- |
| Hash | `4df2be1b1be59111` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/pre-sign-up/handler.ts`

~~~
import type { PreSignUpTriggerHandler } from "aws-lambda";
import { env } from "$amplify/env/pre-sign-up";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes["email"];

  if (!email.endsWith(env.ALLOW_DOMAIN)) {
throw new Error("Invalid email domain");
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `6c5a21475b7e7a44` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./pre-sign-up/resource";

export const auth = defineAuth({
  // ...
  triggers: {
preSignUp,
  },
});

~~~

| | |
| -- | -- |
| Hash | `b723d71fb646496c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
