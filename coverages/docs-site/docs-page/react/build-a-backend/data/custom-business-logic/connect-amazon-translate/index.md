[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/

Coverage: 0.0%

#### `Terminal`

~~~
npm add @aws-sdk/client-translate

~~~

| | |
| -- | -- |
| Hash | `866e7a4da60b689f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
});

const dataStack = Stack.of(backend.data);

const translateDataSource = backend.data.addHttpDataSource(
  "TranslateDataSource",
  `https://translate.${dataStack.region}.amazonaws.com`,
  {
authorizationConfig: {
  signingRegion: dataStack.region,
  signingServiceName: "translate",
},
  },
);

translateDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
actions: ["translate:TranslateText"],
resources: ["*"],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `c413a6f4bbb777ac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/translate.js`

~~~
export function request(ctx) {
  return {
method: "POST",
resourcePath: "/",
params: {
  body: {
    SourceLanguageCode: ctx.arguments.sourceLanguage,
    TargetLanguageCode: ctx.arguments.targetLanguage,
    Text: ctx.arguments.text,
  },
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
    "X-Amz-Target": "AWSShineFrontendService_20170701.TranslateText",
  },
},
  };
}

export function response(ctx) {
  return JSON.parse(ctx.result.body).TranslatedText;
}

~~~

| | |
| -- | -- |
| Hash | `c824b7f789a5b258` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  translate: a
.query()
.arguments({
  sourceLanguage: a.string().required(),
  targetLanguage: a.string().required(),
  text: a.string().required(),
})
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "TranslateDataSource",
    entry: "./translate.js",
  }),
),
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
| Hash | `40af1d5454d7a4a4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { data } = await client.queries.translate({
  sourceLanguage: "en",
  targetLanguage: "es",
  text: "Hello World!",
});

~~~

| | |
| -- | -- |
| Hash | `81e213bec681832b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
