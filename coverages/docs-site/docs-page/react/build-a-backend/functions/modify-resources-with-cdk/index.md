[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/modify-resources-with-cdk/

Coverage: 0.0%

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { myFunction } from "./functions/my-function";

const backend = defineBackend({
  myFunction,
});

// CDK constructs can be accessed via
backend.myFunction.resources;

// where the Lambda function can be found on
backend.myFunction.resources.lambda;

~~~

| | |
| -- | -- |
| Hash | `2e3dc17cabd45c14` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
