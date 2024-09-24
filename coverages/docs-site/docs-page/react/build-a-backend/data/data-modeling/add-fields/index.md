[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/

Coverage: 0.0%

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
});

~~~

| | |
| -- | -- |
| Hash | `43905c308842f472` |
| Covered | ❌ |

##### Covering Regions

- *None*

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
});

~~~

| | |
| -- | -- |
| Hash | `f888c3d166c2cecc` |
| Covered | ❌ |

##### Covering Regions

- *None*

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
a.schema({
  Post: a.model({
privacySetting: a.enum(["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]),
content: a.string(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `820795dcb914b7d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

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
});

~~~

| | |
| -- | -- |
| Hash | `3285944c721301a5` |
| Covered | ❌ |

##### Covering Regions

- *None*

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const availableSettings = client.enums.PrivacySetting.values();
// availableSettings returns ["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]

~~~

| | |
| -- | -- |
| Hash | `1f73a4fff6b93118` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().required(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `cdf4d0b665542edb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().required(),
notes: a.string().array(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `dc3c19f2f62eb37c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().default("My new Todo"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `9f1c692ef6b1f458` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
