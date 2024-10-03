[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/

Coverage: 12.5%

#### `Terminal`

~~~
npm add @aws-sdk/client-rekognition

~~~

| | |
| -- | -- |
| Hash | `db746639848e0a89` |
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
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const dataStack = Stack.of(backend.data);

// Set environment variables for the S3 Bucket name
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  S3_BUCKET_NAME: backend.storage.resources.bucket.bucketName,
};

const rekognitionDataSource = backend.data.addHttpDataSource(
  "RekognitionDataSource",
  `https://rekognition.${dataStack.region}.amazonaws.com`,
  {
authorizationConfig: {
  signingRegion: dataStack.region,
  signingServiceName: "rekognition",
},
  },
);

rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
actions: ["rekognition:DetectText", "rekognition:DetectLabels"],
resources: ["*"],
  }),
);

backend.storage.resources.bucket.grantReadWrite(
  rekognitionDataSource.grantPrincipal,
);

~~~

| | |
| -- | -- |
| Hash | `dd7bcc3731acb6d0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/identifyText.ts`

~~~
export function request(ctx) {
  return {
method: "POST",
resourcePath: "/",
params: {
  body: {
    Image: {
S3Object: {
  Bucket: ctx.env.S3_BUCKET_NAME,
  Name: ctx.arguments.path,
},
    },
  },
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
    "X-Amz-Target": "RekognitionService.DetectText",
  },
},
  };
}

export function response(ctx) {
  return JSON.parse(ctx.result.body)
.TextDetections.filter((item) => item.Type === "LINE")
.map((item) => item.DetectedText)
.join("\n")
.trim();
}

~~~

| | |
| -- | -- |
| Hash | `e93e201396687ac8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  identifyText: a
.query()
.arguments({
  path: a.string(),
})
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./identifyText.js",
    dataSource: "RekognitionDataSource",
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
| Hash | `b81c707fc1695eb1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "predictions_gen2",
  access: (allow) => ({
"public/*": [allow.guest.to(["list", "write", "get"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `85d2795e6ccb1296` |
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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/root.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/root.ts#L23)

---

#### `App.tsx`

~~~
import { type ChangeEvent, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";
import { Schema } from "@/amplify/data/resource";
import "./App.css";

// Generating the client
const client = generateClient<Schema>();

type IdentifyTextReturnType = Schema["identifyText"]["returnType"];

function App() {
  // State to hold the recognized text
  const [path, setPath] = useState<string>("");
  const [textData, setTextData] = useState<IdentifyTextReturnType>();

  // Function to handle file upload to S3 bucket
  const handleTranslate = async (event: ChangeEvent<HTMLInputElement>) => {
if (event.target.files) {
  const file = event.target.files[0];

  const s3Path = "public/" + file.name;

  try {
    uploadData({
path: s3Path,
data: file,
    });

    setPath(s3Path);
  } catch (error) {
    console.error(error);
  }
}
  };

  // Function to recognize text from the uploaded image
  const recognizeText = async () => {
// Identifying text in the uploaded image
const { data } = await client.queries.identifyText({
  path, // File name
});
setTextData(data);
  };

  return (
<div>
  <h1>Amazon Rekognition Text Recognition</h1>
  <div>
    <input type="file" onChange={handleTranslate} />
    <button onClick={recognizeText}>Recognize Text</button>
    <div>
<h3>Recognized Text:</h3>
{textData}
    </div>
  </div>
</div>
  );
}

export default App;

~~~

| | |
| -- | -- |
| Hash | `cae12f526b62efc6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
