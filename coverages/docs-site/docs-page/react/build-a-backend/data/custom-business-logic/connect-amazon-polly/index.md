[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/

Coverage: 0.0%

#### `Terminal`

~~~
npm add @aws-sdk/client-polly

~~~

| | |
| -- | -- |
| Hash | `cbe3464e3ab1b8d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "predictions_gen2",
});

~~~

| | |
| -- | -- |
| Hash | `a043adb860e7a842` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, convertTextToSpeech } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  convertTextToSpeech,
});

backend.convertTextToSpeech.resources.lambda.addToRolePolicy(
  new PolicyStatement({
actions: ["polly:StartSpeechSynthesisTask"],
resources: ["*"],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `059b08381cc3873c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/convertTextToSpeech.ts`

~~~
import { Schema } from "./resource";
import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
} from "@aws-sdk/client-polly";
import { env } from "$amplify/env/convertTextToSpeech";

export const handler: Schema["convertTextToSpeech"]["functionHandler"] = async (
  event,
) => {
  const client = new PollyClient();
  const task = new StartSpeechSynthesisTaskCommand({
OutputFormat: "mp3",
SampleRate: "8000",
Text: event.arguments.text,
TextType: "text",
VoiceId: "Amy",
OutputS3BucketName: env.PREDICTIONS_GEN_2_BUCKET_NAME,
OutputS3KeyPrefix: "public/",
  });
  const result = await client.send(task);

  return (
result.SynthesisTask?.OutputUri?.replace(
  "https://s3.us-east-1.amazonaws.com/" +
    env.PREDICTIONS_GEN_2_BUCKET_NAME +
    "/public/",
  "",
) ?? ""
  );
};

~~~

| | |
| -- | -- |
| Hash | `b46626c46832e9ff` |
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

export const convertTextToSpeech = defineFunction({
  entry: "./convertTextToSpeech.ts",
});

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  convertTextToSpeech: a
.mutation()
.arguments({
  text: a.string().required(),
})
.returns(a.string().required())
.authorization((allow) => [allow.publicApiKey()])
.handler(a.handler.function(convertTextToSpeech)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
// API Key is used for allow.publicApiKey() rules
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `5b8929bd948f9263` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";
import { convertTextToSpeech } from "../data/resource";

export const storage = defineStorage({
  name: "predictions_gen2",
  access: (allow) => ({
"public/*": [
  allow.resource(convertTextToSpeech).to(["write"]),
  allow.guest.to(["read", "write"]),
],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `8afad9fd1d529ce1` |
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

#### `App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useState } from "react";

const client = generateClient<Schema>();

type PollyReturnType = Schema["convertTextToSpeech"]["returnType"];

function App() {
  const [src, setSrc] = useState("");
  const [file, setFile] = useState<PollyReturnType>("");
  return (
<div className="flex flex-col">
  <button
    onClick={async () => {
const { data, errors } = await client.mutations.convertTextToSpeech({
  text: "Hello World!",
});

if (!errors && data) {
  setFile(data);
} else {
  console.log(errors);
}
    }}
  >
    Synth
  </button>
  <button
    onClick={async () => {
const res = await getUrl({
  path: "public/" + file,
});

setSrc(res.url.toString());
    }}
  >
    Fetch audio
  </button>
  <a href={src}>Get audio file</a>
</div>
  );
}

export default App;

~~~

| | |
| -- | -- |
| Hash | `9469ad173d3b73ca` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
