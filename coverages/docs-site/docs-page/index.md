[<- Back to index](../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/

Coverage: 0.0%

#### `amplify/backend.ts`

~~~
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

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
| Hash | `fe8797e13aaa1221` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../docs-pages.md)
