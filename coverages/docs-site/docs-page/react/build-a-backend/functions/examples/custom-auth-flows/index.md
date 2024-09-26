[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/

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

#### `amplify/auth/create-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `a3e090a743d04a5f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/create-auth-challenge/handler.ts`

~~~
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
// Generate a random code for the custom challenge
const challengeCode = "123456";

event.response.challengeMetadata = "TOKEN_CHECK";

event.response.publicChallengeParameters = {
  trigger: "true",
  code: challengeCode,
};

event.response.privateChallengeParameters = { trigger: "true" };
event.response.privateChallengeParameters.answer = challengeCode;
  }
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `40aa58cbc423c8e3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/define-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `02beb77eace696f3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/define-auth-challenge/handler.ts`

~~~
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // Check if this is the first authentication attempt
  if (event.request.session.length === 0) {
// For the first attempt, we start with the custom challenge
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
event.request.session.length === 1 &&
event.request.session[0].challengeName === "CUSTOM_CHALLENGE" &&
event.request.session[0].challengeResult === true
  ) {
// If this is the second attempt (session length 1),
// it was a CUSTOM_CHALLENGE, and the result was successful
event.response.issueTokens = true;
event.response.failAuthentication = false;
  } else {
// If we reach here, it means either:
// 1. The custom challenge failed
// 2. We've gone through more attempts than expected
// In either case, we fail the authentication
event.response.issueTokens = false;
event.response.failAuthentication = true;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `74b493084dedc9b3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/define-auth-challenge/handler.ts`

~~~
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // First attempt: Start with SRP_A (Secure Remote Password protocol, step A)
  if (event.request.session.length === 0) {
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "SRP_A";
  } else if (
event.request.session.length === 1 &&
event.request.session[0].challengeName === "SRP_A" &&
event.request.session[0].challengeResult === true
  ) {
// Second attempt: SRP_A was successful, move to PASSWORD_VERIFIER
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "PASSWORD_VERIFIER";
  } else if (
event.request.session.length === 2 &&
event.request.session[1].challengeName === "PASSWORD_VERIFIER" &&
event.request.session[1].challengeResult === true
  ) {
// Third attempt: PASSWORD_VERIFIER was successful, move to CUSTOM_CHALLENGE
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
event.request.session.length === 3 &&
event.request.session[2].challengeName === "CUSTOM_CHALLENGE" &&
event.request.session[2].challengeResult === true
  ) {
// Fourth attempt: CUSTOM_CHALLENGE was successful, authentication complete
event.response.issueTokens = true;
event.response.failAuthentication = false;
  } else {
// If we reach here, it means one of the challenges failed or
// we've gone through more attempts than expected
event.response.issueTokens = false;
event.response.failAuthentication = true;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a3dec3c66d5195fd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/verify-auth-challenge-response/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
});

~~~

| | |
| -- | -- |
| Hash | `ce4044d78084f67a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/verify-auth-challenge-response/handler.ts`

~~~
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event,
) => {
  event.response.answerCorrect = true;
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `3861b7461a8951c5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { createAuthChallenge } from "./create-auth-challenge/resource";
import { defineAuthChallenge } from "./define-auth-challenge/resource";
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
createAuthChallenge,
defineAuthChallenge,
verifyAuthChallengeResponse,
  },
});

~~~

| | |
| -- | -- |
| Hash | `14ad131b8716bb9b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
