[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/

Coverage: 0.0%

#### `amplify/auth/pre-sign-up/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: "pre-sign-up",
});

~~~

| | |
| -- | -- |
| Hash | `a1c0bf89b3049524` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/pre-sign-up/handler.ts`

~~~
import type { PreSignUpTriggerHandler } from "aws-lambda";

function isOlderThan(date: Date, age: number) {
  const comparison = new Date();
  comparison.setFullYear(comparison.getFullYear() - age);
  return date.getTime() > comparison.getTime();
}

export const handler: PreSignUpTriggerHandler = async (event) => {
  const birthdate = new Date(event.request.userAttributes["birthdate"]);

  // you must be 13 years or older
  if (!isOlderThan(birthdate, 13)) {
throw new Error("You must be 13 years or older to use this site");
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `70b553df14441114` |
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
