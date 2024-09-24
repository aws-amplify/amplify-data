[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/

Coverage: 0.0%

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, MODEL_ID, generateHaikuFunction } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  generateHaikuFunction,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
effect: Effect.ALLOW,
actions: ["bedrock:InvokeModel"],
resources: [`arn:aws:bedrock:*::foundation-model/${MODEL_ID}`],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `1008539ad82da723` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
});

const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
authorizationConfig: {
  signingRegion: Stack.of(backend.data).region,
  signingServiceName: "bedrock",
},
  },
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
effect: Effect.ALLOW,
actions: ["bedrock:InvokeModel"],
resources: [
  `arn:aws:bedrock:${Stack.of(backend.data).region}::foundation-model/${MODEL_ID}`,
],
  }),
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID,
};

~~~

| | |
| -- | -- |
| Hash | `6f99fa643c27dcea` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
MODEL_ID,
  },
});

const schema = a.schema({
  generateHaiku: a
.query()
.arguments({ prompt: a.string().required() })
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(a.handler.function(generateHaikuFunction)),
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
| Hash | `b9d1d222318eb979` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  generateHaiku: a
.query()
.arguments({ prompt: a.string().required() })
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "BedrockDataSource",
    entry: "./generateHaiku.js",
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
| Hash | `f0d45d7747bca578` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/generateHaiku.ts`

~~~
import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

// initialize bedrock runtime client
const client = new BedrockRuntimeClient();

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event,
  context,
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
modelId: process.env.MODEL_ID,
contentType: "application/json",
accept: "application/json",
body: JSON.stringify({
  anthropic_version: "bedrock-2023-05-31",
  system:
    "You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.",
  messages: [
    {
role: "user",
content: [
  {
    type: "text",
    text: prompt,
  },
],
    },
  ],
  max_tokens: 1000,
  temperature: 0.5,
}),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);

  // Parse the response and return the generated haiku
  const data = JSON.parse(Buffer.from(response.body).toString());

  return data.content[0].text;
};

~~~

| | |
| -- | -- |
| Hash | `e600f7456a31a935` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/generateHaiku.js`

~~~
export function request(ctx) {
  // Define a system prompt to give the model a persona
  const system =
"You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.";

  const prompt = ctx.args.prompt;

  // Construct the HTTP request to invoke the generative AI model
  return {
resourcePath: `/model/${ctx.env.MODEL_ID}/invoke`,
method: "POST",
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    anthropic_version: "bedrock-2023-05-31",
    system,
    messages: [
{
  role: "user",
  content: [
    {
      type: "text",
      text: prompt,
    },
  ],
},
    ],
    max_tokens: 1000,
    temperature: 0.5,
  },
},
  };
}

// Parse the response and return the generated haiku
export function response(ctx) {
  const res = JSON.parse(ctx.result.body);
  const haiku = res.content[0].text;

  return haiku;
}

~~~

| | |
| -- | -- |
| Hash | `cbe2dc17aef258b0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
const { data, errors } = await client.queries.generateHaiku({
  prompt: "Frank Herbert's Dune",
});

~~~

| | |
| -- | -- |
| Hash | `52d66c7ca199349d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `App.tsx`

~~~
import { FormEvent, useState } from "react";

import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);

  const sendPrompt = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();

const { data, errors } = await client.queries.generateHaiku({
  prompt,
});

if (!errors) {
  setAnswer(data);
  setPrompt("");
} else {
  console.log(errors);
}
  };

  return (
<main className="flex min-h-screen flex-col items-center justify-center p-24 dark:text-white">
  <div>
    <h1 className="text-3xl font-bold text-center mb-4">Haiku Generator</h1>

    <form className="mb-4 self-center max-w-[500px]" onSubmit={sendPrompt}>
<input
  className="text-black p-2 w-full"
  placeholder="Enter a prompt..."
  name="prompt"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
/>
    </form>

    <div className="text-center">
<pre>{answer}</pre>
    </div>
  </div>
</main>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c90ccefcb690e15b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
