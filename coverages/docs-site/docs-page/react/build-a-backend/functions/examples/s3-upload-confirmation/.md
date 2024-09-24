[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/

Coverage: 0.0%

#### `Terminal`

~~~
npm add --save @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `1b374687de452eb3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineFunction, defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myProjectFiles",
  triggers: {
onUpload: defineFunction({
  entry: "./on-upload-handler.ts",
}),
  },
});

~~~

| | |
| -- | -- |
| Hash | `a1c51652375ff7aa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/on-upload-handler.ts`

~~~
import type { S3Handler } from "aws-lambda";

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Upload handler invoked for objects [${objectKeys.join(", ")}]`);
};

~~~

| | |
| -- | -- |
| Hash | `1da9411beef016a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
