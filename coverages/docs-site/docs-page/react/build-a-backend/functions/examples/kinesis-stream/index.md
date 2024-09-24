[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/

Coverage: 0.0%

#### `Terminal`

~~~
npm add @aws-lambda-powertools/logger @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `971716d4c93fe3b6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/kinesis-function/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const myKinesisFunction = defineFunction({
  name: "kinesis-function",
});

~~~

| | |
| -- | -- |
| Hash | `8f81a185041222d2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/kinesis-function/handler.ts`

~~~
import type {
  KinesisStreamBatchResponse,
  KinesisStreamHandler,
  KinesisStreamRecordPayload,
} from "aws-lambda";
import { Buffer } from "node:buffer";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "kinesis-stream-handler",
});

export const handler: KinesisStreamHandler = async (
  event,
  context,
): Promise<KinesisStreamBatchResponse> => {
  for (const record of event.Records) {
try {
  logger.info(`Processed Kinesis Event - EventID: ${record.eventID}`);
  const recordData = await getRecordDataAsync(record.kinesis);
  logger.info(`Record Data: ${recordData}`);
} catch (err) {
  logger.error(`An error occurred ${err}`);
  /*
  When processing stream data, if any item fails, returning the failed item's position immediately
  prompts Lambda to retry from this item forward, ensuring continuous processing without skipping data.
  */
  return {
    batchItemFailures: [{ itemIdentifier: record.kinesis.sequenceNumber }],
  };
}
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);
  return { batchItemFailures: [] };
};

async function getRecordDataAsync(
  payload: KinesisStreamRecordPayload,
): Promise<string> {
  const data = Buffer.from(payload.data, "base64").toString("utf-8");
  await Promise.resolve(1); // Placeholder for an async process
  return data;
}

~~~

| | |
| -- | -- |
| Hash | `39fa4e3a9d6197d9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { Stream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { KinesisEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myKinesisFunction } from "./functions/kinesis-function/resource";

const backend = defineBackend({
  auth,
  data,
  myKinesisFunction,
});

const kinesisStack = backend.createStack("kinesis-stack");

const kinesisStream = new Stream(kinesisStack, "KinesisStream", {
  streamName: "myKinesisStream",
  shardCount: 1,
});

const eventSource = new KinesisEventSource(kinesisStream, {
  startingPosition: StartingPosition.LATEST,
  reportBatchItemFailures: true,
});

backend.myKinesisFunction.resources.lambda.addEventSource(eventSource);

~~~

| | |
| -- | -- |
| Hash | `839e597bc631f205` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
