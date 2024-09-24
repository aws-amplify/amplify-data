[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/

Coverage: 0.0%

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";
import { generateMonthlyReports } from "../functions/generate-monthly-reports/resource";

export const storage = defineStorage({
  name: "myReports",
  access: (allow) => ({
"reports/*": [
  allow.resource(generateMonthlyReports).to(["read", "write", "delete"]),
],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `0d24121ec15795f1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/generate-monthly-reports/handler.ts`

~~~
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "$amplify/env/generate-monthly-reports";

const s3Client = new S3Client();

export const handler = async () => {
  const command = new PutObjectCommand({
Bucket: env.MY_REPORTS_BUCKET_NAME,
Key: `reports/${new Date().toISOString()}.csv`,
Body: new Blob([""], { type: "text/csv;charset=utf-8;" }),
  });

  await s3Client.send(command);
};

~~~

| | |
| -- | -- |
| Hash | `99258be1f75a8f39` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { weeklyDigest } from "./functions/weekly-digest/resource";

const backend = defineBackend({
  weeklyDigest,
});

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda;

const topicStack = backend.createStack("WeeklyDigest");
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest",
});

const statement = new iam.PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["sns:Publish"],
  resources: [topic.topicArn],
});

weeklyDigestLambda.addToRolePolicy(statement);

~~~

| | |
| -- | -- |
| Hash | `762565227d0cd347` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { weeklyDigest } from "./functions/weekly-digest/resource";

const backend = defineBackend({
  weeklyDigest,
});

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda;

const topicStack = backend.createStack("WeeklyDigest");
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest",
});

topic.grantPublish(weeklyDigestLambda);

~~~

| | |
| -- | -- |
| Hash | `a3c8effc91ad348c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
