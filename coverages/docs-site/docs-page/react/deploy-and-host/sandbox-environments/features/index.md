[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/

Coverage: 0.0%

#### `Unnamed Snippet`

~~~
npx ampx sandbox secret set foo
? Enter secret value: ###
Done!

npx ampx sandbox secret set bar
? Enter secret value: ###
Done!

~~~

| | |
| -- | -- |
| Hash | `177325bd7103d995` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox secret list
 - foo
 - bar

~~~

| | |
| -- | -- |
| Hash | `9e94e7e14cde9252` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox secret get foo
name: foo
version: 1
value: abc123
lastUpdated: Mon Nov 13 2023 22:19:12 GMT-0800 (Pacific Standard Time)

~~~

| | |
| -- | -- |
| Hash | `9cf830d5a5340ca0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

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

#### `Unnamed Snippet`

~~~
npx ampx sandbox secret set foo --profile work

~~~

| | |
| -- | -- |
| Hash | `cc09b88bc8ecbeec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature1sandbox

~~~

| | |
| -- | -- |
| Hash | `83d31f061c8eaf8b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature2sandbox

~~~

| | |
| -- | -- |
| Hash | `84b833ec4343dc7d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature1sandbox secret set baz

~~~

| | |
| -- | -- |
| Hash | `a08360d3543e0fee` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox --outputs-out-dir ./path/to/config --outputs-format ["json", "dart"]

~~~

| | |
| -- | -- |
| Hash | `e1d0dea68bca6848` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx generate outputs --app-id <your-amplify-app-id> --branch main --format ["json", "dart"] --out-dir ./path/to/config

~~~

| | |
| -- | -- |
| Hash | `7874ae3a5848eda9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx generate outputs --app-id <app-id> --branch main

~~~

| | |
| -- | -- |
| Hash | `0c0d50bd53d09ce1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
npx ampx generate graphql-client-code
--format [choices: "modelgen", "graphql-codegen", "introspection"]

~~~

| | |
| -- | -- |
| Hash | `28167ac180eae7dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
