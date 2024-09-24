[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/

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

#### `amplify/auth/custom-message/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const customMessage = defineFunction({
  name: "custom-message",
});

~~~

| | |
| -- | -- |
| Hash | `b9f42270438de5a4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/custom-message/handler.ts`

~~~
import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
const locale = event.request.userAttributes["locale"];
if (locale === "en") {
  event.response.emailMessage = `Your new one-time code is ${event.request.codeParameter}`;
  event.response.emailSubject = "Reset my password";
} else if (locale === "es") {
  event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
  event.response.emailSubject = "Restablecer mi contraseña";
}
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `94344039cff6638a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { customMessage } from "./custom-message/resource";

export const auth = defineAuth({
  // ...
  triggers: {
customMessage,
  },
});

~~~

| | |
| -- | -- |
| Hash | `9475e9c0f178a185` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
