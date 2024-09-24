[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/

Coverage: 0.0%

#### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  entry: "./demo-function-handler.ts",
  name: "overrideName", // explicitly set the name to override the default naming behavior
});

~~~

| | |
| -- | -- |
| Hash | `e096b9f54c2de0fb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  timeoutSeconds: 60, // 1 minute timeout
});

~~~

| | |
| -- | -- |
| Hash | `9ddcadbec076fffb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  memoryMB: 256, // allocate 256 MB of memory to the function.
});

~~~

| | |
| -- | -- |
| Hash | `f296449660a68062` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  runtime: 20, // use Node 20
});

~~~

| | |
| -- | -- |
| Hash | `c750380bfe065319` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  entry: "./path/to/handler.ts", // this path should either be absolute or relative to the current file
});

~~~

| | |
| -- | -- |
| Hash | `968447ad26e96e85` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
