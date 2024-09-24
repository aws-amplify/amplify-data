[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/

Coverage: 0.0%

#### `tsconfig.json`

~~~
{
  "exclude": ["amplify/**/*"]
}

~~~

| | |
| -- | -- |
| Hash | `9f5432bf9c0150d4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `package.json`

~~~
{
  "name": "my-backend",
  "private": true,
  "exports": {
"./schema": "./amplify/data/resource.ts",
"./outputs": "./amplify_outputs.json"
  }
}

~~~

| | |
| -- | -- |
| Hash | `20eb39b36497e0a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
