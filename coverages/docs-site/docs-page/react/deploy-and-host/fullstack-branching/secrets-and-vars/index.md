[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/

Coverage: 0.0%

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
| Covered | ❌ |

##### Covering Regions

- *None*

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox secret remove foo

~~~

| | |
| -- | -- |
| Hash | `891a804e7948f947` |
| Covered | ❌ |

##### Covering Regions

- *None*

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
console.log("REACT_APP_TEST_VARIABLE", process.env.REACT_APP_TEST_VARIABLE);

~~~

| | |
| -- | -- |
| Hash | `a1db81993e18ae6a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
