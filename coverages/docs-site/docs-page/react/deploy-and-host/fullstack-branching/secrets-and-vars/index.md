[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/

Coverage: 100.0%

#### `Terminal`

~~~
npx ampx sandbox secret set foo
? Enter secret value: ###
Done!

> npx ampx sandbox secret set bar
? Enter secret value: ###
Done!

~~~

| | |
| -- | -- |
| Hash | `1877f2be69c8f496` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#22)

---

#### `Unnamed Snippet`

~~~
import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
externalProviders: {
  facebook: {
    clientId: secret("foo"),
    clientSecret: secret("bar"),
  },
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `57a89d85904e35df` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#18)

---

#### `Terminal`

~~~
npx ampx sandbox secret remove foo

~~~

| | |
| -- | -- |
| Hash | `891a804e7948f947` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#18)

---

#### `amplify.yml`

~~~
build:
  commands:
- echo "REACT_APP_TEST_VARIABLE=$REACT_APP_TEST_VARIABLE" >> .env
- npm run build

~~~

| | |
| -- | -- |
| Hash | `89f1b18d54b81799` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#22)

---

#### `Unnamed Snippet`

~~~
console.log("REACT_APP_TEST_VARIABLE", process.env.REACT_APP_TEST_VARIABLE);

~~~

| | |
| -- | -- |
| Hash | `a1db81993e18ae6a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#16)

---

[<- Back to index](../../../../../docs-pages.md)
