[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
a.schema({
  Post: a.model({
location: a.customType({
  lat: a.float(),
  long: a.float(),
}),
content: a.string(),
  }),
}).authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `279bf864a21cd97b` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L75)

---

#### `Unnamed Snippet`

~~~
a.schema({
  Location: a.customType({
lat: a.float(),
long: a.float(),
  }),

  Post: a.model({
location: a.ref("Location"),
content: a.string(),
  }),

  User: a.model({
lastKnownLocation: a.ref("Location"),
  }),
}).authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `b7fd0a0c85d7fa05` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L155)

---

#### `Unnamed Snippet`

~~~
const { data: newPost, errors } = await client.models.Post.create({
  location: {
lat: 48.837006,
long: 8.28245,
  },
});

console.log(newPost?.location?.lat, newPost?.location?.long);

~~~

| | |
| -- | -- |
| Hash | `230bf27a1eb5947d` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L210)

---

#### `Unnamed Snippet`

~~~
a.schema({
  Post: a.model({
privacySetting: a.enum(["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]),
content: a.string(),
  }),
}).authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `35bf03594722226f` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L306)

---

#### `Unnamed Snippet`

~~~
a.schema({
  PrivacySetting: a.enum(["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]),

  Post: a.model({
content: a.string(),
privacySetting: a.ref("PrivacySetting"),
  }),

  Video: a.model({
privacySetting: a.ref("PrivacySetting"),
  }),
}).authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `f88634036e3d5189` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L418)

---

#### `Unnamed Snippet`

~~~
client.models.Post.create({
  content: "hello",
  // WORKS - value auto-completed
  privacySetting: "PRIVATE",

  // DOES NOT WORK - TYPE ERROR
  privacySetting: "NOT_PUBLIC",
});

~~~

| | |
| -- | -- |
| Hash | `53b6683a37d9bc50` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L395)

---

#### `Unnamed Snippet`

~~~
const availableSettings = client.enums.PrivacySetting.values();
// availableSettings returns ["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]

~~~

| | |
| -- | -- |
| Hash | `1f73a4fff6b93118` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L475)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Todo: a.model({
  content: a.string().required(),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `0d26c55b7f416673` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L512)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Todo: a.model({
  content: a.string().required(),
  notes: a.string().array(),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `2b588d62751dc8ee` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L540)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Todo: a.model({
  content: a.string().default("My new Todo"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `74405b7e731fd3fd` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L593)

---

[<- Back to index](../../../../../../docs-pages.md)
