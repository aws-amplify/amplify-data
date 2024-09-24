[<- Back to index](../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/start/manual-installation/

Coverage: 90.9%

#### `Terminal`

~~~
npm create amplify@latest

~~~

| | |
| -- | -- |
| Hash | `49c40ffdf76ab492` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### `Terminal`

~~~
? Where should we create your project? (.) # press enter

~~~

| | |
| -- | -- |
| Hash | `d8b7d661117c2360` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   ├── tsconfig.json
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `ce40c8a92db3a16a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### `Terminal`

~~~
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript

~~~

| | |
| -- | -- |
| Hash | `1ee5fa5533406d7c` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";

defineBackend({});

~~~

| | |
| -- | -- |
| Hash | `4c4780536e17d44f` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### `Unnamed Snippet`

~~~
The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("@aws-amplify/backend")' call instead.

~~~

| | |
| -- | -- |
| Hash | `46e660ca9e2b4a99` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

---

#### `Unnamed Snippet`

~~~
{
  "type": "module"
}

~~~

| | |
| -- | -- |
| Hash | `3ca9d4afd2142508` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

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

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

---

#### `amplify/data/resource.ts`

~~~
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `b497a376ca20c1f5` |
| Covered | ❌ |

##### Covering Regions

- *None*

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

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/reference/project-structure.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

---

#### `Terminal`

~~~
npm update @aws-amplify/backend@latest @aws-amplify/backend-cli@latest

~~~

| | |
| -- | -- |
| Hash | `e02df4dc8f85e45e` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/manual-installation.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

---

[<- Back to index](../../../../docs-pages.md)
