[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/

Coverage: 0.0%

#### `Terminal`

~~~
npm add --save-dev @aws-lambda-powertools/logger @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `e083d0c2dbcc4af0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/dynamoDB-function/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const myDynamoDBFunction = defineFunction({
  name: "dynamoDB-function",
});

~~~

| | |
| -- | -- |
| Hash | `21cd0df008404d02` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/dynamoDB-function/handler.ts`

~~~
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
logger.info(`Processing record: ${record.eventID}`);
logger.info(`Event Type: ${record.eventName}`);

if (record.eventName === "INSERT") {
  // business logic to process new records
  logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
}
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
batchItemFailures: [],
  };
};

~~~

| | |
| -- | -- |
| Hash | `9c30e650d7a58bed` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

const backend = defineBackend({
  auth,
  data,
  myDynamoDBFunction,
});

const todoTable = backend.data.resources.tables["Todo"];
const policy = new Policy(
  Stack.of(todoTable),
  "MyDynamoDBFunctionStreamingPolicy",
  {
statements: [
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
"dynamodb:DescribeStream",
"dynamodb:GetRecords",
"dynamodb:GetShardIterator",
"dynamodb:ListStreams",
    ],
    resources: ["*"],
  }),
],
  },
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
  Stack.of(todoTable),
  "MyDynamoDBFunctionTodoEventStreamMapping",
  {
target: backend.myDynamoDBFunction.resources.lambda,
eventSourceArn: todoTable.tableStreamArn,
startingPosition: StartingPosition.LATEST,
  },
);

mapping.node.addDependency(policy);

~~~

| | |
| -- | -- |
| Hash | `c1748580a80e9b2c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
