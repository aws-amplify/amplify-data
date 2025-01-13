[<- Back to index](../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/

Coverage: 100.0%

#### `amplify/backend.ts`

~~~
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("MyCustomResources");

new sqs.Queue(customResourceStack, "CustomQueue");
new sns.Topic(customResourceStack, "CustomTopic");

~~~

| | |
| -- | -- |
| Hash | `193a2a390fb5a565` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/root.ts](../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/root.ts#L8)

---

[<- Back to index](../../docs-pages.md)
