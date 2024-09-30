[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
├── apps/
│   ├── admin-dashboard/
│   │   ├── next.config.mjs
│   │   └── package.json
│   └── marketing-site/
│       ├── astro.config.mjs
│       └── package.json
├── packages/
│   └── my-shared-backend/
│       ├── amplify/
│       │   ├── auth/
│       │   │   └── resource.ts
│       │   ├── data/
│       │   │   └── resource.ts
│       │   └── backend.ts
│       |── package.json
    └── tsconfig.json
└── package.json

~~~

| | |
| -- | -- |
| Hash | `24ba8fa46ca0b5dc` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#L14)

---

#### `Terminal`

~~~
npx ampx generate outputs --branch main --app-id BACKEND-APP-ID

~~~

| | |
| -- | -- |
| Hash | `08fd21f5eafe9848` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#L14)

---

#### `Terminal`

~~~
npx ampx generate outputs --branch main --app-id BACKEND-APP-ID

~~~

| | |
| -- | -- |
| Hash | `08fd21f5eafe9848` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#L14)

---

#### `tsconfig.json`

~~~
{
  "compilerOptions": {
"paths": {
  "@/data-schema": ["./packages/my-shared-backend/amplify/data/resource"]
}
  }
}

~~~

| | |
| -- | -- |
| Hash | `be4357236b96055a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#L14)

---

#### `apps/admin-dashboard/page.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/data-schema";

const client = generateClient<Schema>();

const createTodo = async () => {
  await client.models.Todo.create({
content: window.prompt("Todo content?"),
isDone: false,
  });
};

~~~

| | |
| -- | -- |
| Hash | `3137a2b60aedf773` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/mutate-data.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/mutate-data.ts#L57)

---

[<- Back to index](../../../../../docs-pages.md)
