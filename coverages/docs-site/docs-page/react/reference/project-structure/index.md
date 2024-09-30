[<- Back to index](../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/reference/project-structure/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `a99febff4c75ee81` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#L9)

---

#### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   ├── custom-message/
│   │   │   ├── custom-message.tsx
│   │   │   ├── handler.ts
│   │   │   ├── package.json
│   │   │   └── resource.ts
│   │   ├── post-confirmation.ts
│   │   ├── pre-sign-up.ts
│   │   ├── resource.ts
│   │   └── verification-email.tsx
│   ├── data/
│   │   ├── resolvers/
│   │   │   ├── list-featured-posts.ts
│   │   │   └── list-top-10-posts.ts
│   │   ├── resource.ts
│   │   └── schema.ts
│   ├── jobs/
│   │   ├── monthly-report/
│   │   │   ├── handler.ts
│   │   │   └── resource.ts
│   │   ├── process-featured-posts/
│   │   │   ├── handler.py
│   │   │   ├── requirements.txt
│   │   │   └── resource.ts
│   │   └── store-top-10-posts/
│   │       ├── handler.ts
│   │       └── resource.ts
│   ├── storage/
│   │   ├── photos/
│   │   │   ├── resource.ts
│   │   │   └── trigger.ts
│   │   └── reports/
│   │       └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `a64e4b7016bb56e7` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#L9)

---

#### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
});

~~~

| | |
| -- | -- |
| Hash | `ffe5e69116dbb94f` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#L9)

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  data,
});

~~~

| | |
| -- | -- |
| Hash | `c754d0fa4a8944d6` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#L11)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#L9)

---

#### `amplify/backend.ts`

~~~
import * as s3 from "aws-cdk-lib/aws-s3";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

// create the bucket and its stack
const bucketStack = backend.getStack("BucketStack");
const bucket = new s3.Bucket(bucketStack, "Bucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

// allow any authenticated user to read and write to the bucket
const authRole = backend.auth.resources.authenticatedUserIamRole;
bucket.grantReadWrite(authRole);

// allow any guest (unauthenticated) user to read from the bucket
const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;
bucket.grantRead(unauthRole);

~~~

| | |
| -- | -- |
| Hash | `b4b49e5b03a1c68e` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#L9)

---

[<- Back to index](../../../../docs-pages.md)
