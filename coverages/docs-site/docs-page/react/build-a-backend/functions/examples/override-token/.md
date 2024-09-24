[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/

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

#### `amplify/auth/pre-token-generation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preTokenGeneration = defineFunction({
  name: "pre-token-generation",
});

~~~

| | |
| -- | -- |
| Hash | `1aac0bf493e838ce` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/pre-token-generation/handler.ts`

~~~
import type { PreTokenGenerationTriggerHandler } from "aws-lambda";

export const handler: PreTokenGenerationTriggerHandler = async (event) => {
  event.response = {
claimsOverrideDetails: {
  groupOverrideDetails: {
    // This will add the user to the cognito group "amplify_group_1"
    groupsToOverride: ["amplify_group_1"],
  },
  claimsToAddOrOverride: {
    // This will add the custom claim "amplfy_attribute" to the id token
    amplfy_attribute: "amplify_gen_2",
  },
},
  };
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a91e9b3ef170f773` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { preTokenGeneration } from "./pre-token-generation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
preTokenGeneration,
  },
});

~~~

| | |
| -- | -- |
| Hash | `19f4c132710a5756` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
{
  "cognito:groups": [
"amplify_group_1"
  ],
  "email_verified": true,
  "iss": "...",
  "cognito:username": "...",
  "origin_jti": "...",
  "amplfy_attribute": "amplify_gen_2",
  "aud": "...",
}

~~~

| | |
| -- | -- |
| Hash | `602ae7b01aff8352` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
