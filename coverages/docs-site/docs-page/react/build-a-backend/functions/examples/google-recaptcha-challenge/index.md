[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/

Coverage: 0.0%

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
  const { request, response } = event;

  if (
// session will contain 3 "steps": SRP, password verification, custom challenge
request.session.length === 2 &&
request.challengeName === "CUSTOM_CHALLENGE"
  ) {
response.publicChallengeParameters = { trigger: "true" };
response.privateChallengeParameters = { answer: "" };
// optionally set challenge metadata
response.challengeMetadata = "CAPTCHA_CHALLENGE";
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `f3ede51911261aeb` |
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
  const { response } = event;
  const [srp, password, captcha] = event.request.session;

  // deny by default
  response.issueTokens = false;
  response.failAuthentication = true;

  if (srp?.challengeName === "SRP_A") {
response.failAuthentication = false;
response.challengeName = "PASSWORD_VERIFIER";
  }

  if (
password?.challengeName === "PASSWORD_VERIFIER" &&
password.challengeResult === true
  ) {
response.failAuthentication = false;
response.challengeName = "CUSTOM_CHALLENGE";
  }

  if (
captcha?.challengeName === "CUSTOM_CHALLENGE" &&
// check for the challenge metadata set in "create-auth-challenge"
captcha?.challengeMetadata === "CAPTCHA_CHALLENGE" &&
captcha.challengeResult === true
  ) {
response.issueTokens = true;
response.failAuthentication = false;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `220e3234773e3f60` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox secret set GOOGLE_RECAPTCHA_SECRET_KEY

~~~

| | |
| -- | -- |
| Hash | `12b6510fc4e3f672` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/verify-auth-challenge-response/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  environment: {
GOOGLE_RECAPTCHA_SECRET_KEY: secret("GOOGLE_RECAPTCHA_SECRET_KEY"),
  },
});

~~~

| | |
| -- | -- |
| Hash | `5f0f8a2ff5b509af` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/verify-auth-challenge-response/handler.ts`

~~~
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";
import { env } from "$amplify/env/verify-auth-challenge-response";

/**
 * Google ReCAPTCHA verification response
 * @see https://developers.google.com/recaptcha/docs/v3#site_verify_response
 */
type GoogleRecaptchaVerifyResponse = {
  // whether this request was a valid reCAPTCHA token for your site
  success: boolean;
  // the score for this request (0.0 - 1.0)
  score: number;
  // the action name for this request (important to verify)
  action: string;
  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  challenge_ts: string;
  // the hostname of the site where the reCAPTCHA was solved
  hostname: string;
  // optional error codes
  "error-codes"?: unknown[];
};

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event,
) => {
  if (!event.request.challengeAnswer) {
throw new Error("Missing challenge answer");
  }

  // https://developers.google.com/recaptcha/docs/verify#api_request
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  const params = new URLSearchParams({
secret: env.GOOGLE_RECAPTCHA_SECRET_KEY,
response: event.request.challengeAnswer,
  });
  url.search = params.toString();

  const request = new Request(url, {
method: "POST",
  });

  const response = await fetch(request);
  const result = (await response.json()) as GoogleRecaptchaVerifyResponse;

  if (!result.success) {
throw new Error("Verification failed", { cause: result["error-codes"] });
  }

  // indicate whether the answer is correct
  event.response.answerCorrect = result.success;

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a278e2c6359ca317` |
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
