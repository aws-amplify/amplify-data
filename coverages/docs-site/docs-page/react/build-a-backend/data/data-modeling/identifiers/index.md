[<- Back to index](../../../../../../docs-pages.md)

# Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/

Coverage: 100.0%

#### `Unnamed Snippet`

```
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  completed: a.boolean(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

```

|         |                    |
| ------- | ------------------ |
| Hash    | `93fbc94ef4f108d8` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/mutate-data.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/mutate-data.ts#L24)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/add-fields.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/add-fields.ts#L75)

---

#### `Unnamed Snippet`

```
const client = generateClient<Schema>();

const todo = await client.models.Todo.create({
  content: "Buy Milk",
  completed: false,
});
console.log(`New Todo created: ${todo.id}`); // New Todo created: 5DB6B4CC-CD41-49F5-9844-57C0AB506B69

```

|         |                    |
| ------- | ------------------ |
| Hash    | `95716a52d6270a63` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/mutate-data.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/mutate-data.ts#L59)

---

#### `Unnamed Snippet`

```
const schema = a.schema({
  Todo: a
.model({
  todoId: a.id().required(),
  content: a.string(),
  completed: a.boolean(),
})
.identifier(["todoId"])
.authorization((allow) => [allow.publicApiKey()]),
});

```

|         |                    |
| ------- | ------------------ |
| Hash    | `d619a12c5b9f68b2` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/identifiers.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/identifiers.ts#L19)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts#L31)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts#L133)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/primary-and-secondary-indexes.ts#L253)

---

#### `Unnamed Snippet`

```
const client = generateClient<Schema>();

const { data: todo, errors } = await client.models.Todo.create({
  todoId: "MyUniqueTodoId",
  content: "Buy Milk",
  completed: false,
});
console.log(`New Todo created: ${todo.todoId}`); // New Todo created: MyUniqueTodoId

```

|         |                    |
| ------- | ------------------ |
| Hash    | `6ffb6c45060a39f9` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/identifiers.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/identifiers.ts#L58)

---

#### `Unnamed Snippet`

```
const schema = a.schema({
  StoreBranch: a
.model({
  geoId: a.id().required(),
  name: a.string().required(),
  country: a.string(),
  state: a.string(),
  city: a.string(),
  zipCode: a.string(),
  streetAddress: a.string(),
})
.identifier(["geoId", "name"])
.authorization((allow) => [allow.publicApiKey()]),
});

```

|         |                    |
| ------- | ------------------ |
| Hash    | `dc84893fe413f132` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/identifiers.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/identifiers.ts#L84)

---

#### `Unnamed Snippet`

```
const client = generateClient<Schema>();

const branch = await client.models.StoreBranch.get({
  geoId: "123",
  name: "Downtown",
}); // All identifier fields are required when retrieving an item

```

|         |                    |
| ------- | ------------------ |
| Hash    | `7a1fb3aa2c192ea3` |
| Covered | ✅                 |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/identifiers.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/identifiers.ts#L133)

---

[<- Back to index](../../../../../../docs-pages.md)
