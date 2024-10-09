[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  content: a.string(),
})
.authorization((allow) => [
  // Allow anyone auth'd with an API key to read everyone's posts.
  allow.publicApiKey().to(["read"]),
  // Allow signed-in user to create, read, update,
  // and delete their __OWN__ posts.
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `e2f15d81cee3ec1a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L15)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
// Because no model-level authorization rule is present
// this model will use the global authorization rule.
Todo: a.model({
  content: a.string(),
}),

// Will use model-level authorization rule
Notes: a
  .model({
    content: a.string(),
    // [Model-level authorization rule]
  })
  .authorization((allow) => [allow.publicApiKey().to(["read"])]),

// [Global authorization rule]
  })
  .authorization((allow) => [allow.publicApiKey()]);

~~~

| | |
| -- | -- |
| Hash | `76ed8e59fffd0aac` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L40)

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  createdBy: a.string(),
  // [Model-level authorization rule]
  // All fields (content, createdBy) will be protected by
  // this authorization rule
})
.authorization((allow) => [
  allow.publicApiKey().to(["read"]),
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `2194b55334d745ad` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L79)

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Employee: a
.model({
  name: a.string(),
  email: a.string(),
  // [Field-level authorization rule]
  // This auth rule will be used for the "ssn" field
  // All other fields will use the model-level auth rule
  ssn: a.string().authorization((allow) => [allow.owner()]),
})

// [Model-level authorization rule]
.authorization((allow) => [
  allow.authenticated().to(["read"]),
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `714da914aa4034ef` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L105)

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  // ...
  listCustomType: a
.query()
.returns(a.ref("CustomType").array())
.handler(
  a.handler.custom({
    entry: "./handler.js",
  }),
)
.authorization((allow) => [
  // Static auth rules - Supported
  allow.guest(),
  allow.publicApiKey(),
  allow.authenticated(),
  allow.group("Admin"),
  allow.groups(["Teacher", "Student"]),

  // Dynamic auth rules - Not supported
  allow.owner(),
  allow.ownerDefinedIn("owner"),
  allow.ownersDefinedIn("otherOwners"),
  allow.groupDefinedIn("group"),
  allow.groupsDefinedIn("otherGroups"),
]),
});

~~~

| | |
| -- | -- |
| Hash | `5e987afe82e5a1ff` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L142)

---

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  content: a.string(),
})
.authorization((allow) => [allow.guest().to(["read"]), allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `d51a9297b3d57373` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L196)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Creating a post is restricted to Cognito User Pools
const { data: newPostResult, errors } = await client.models.Post.create({
  query: queries.createPost,
  variables: { input: { title: "Hello World" } },
  authMode: "userPool",
});

// Listing posts is available to unauthenticated users (verified by Amazon Cognito identity pool's unauthenticated role)
const { data: listPostsResult, errors } = await client.models.Post.list({
  query: queries.listPosts,
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `ba61062287418137` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L50)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L160)

---

[<- Back to index](../../../../../docs-pages.md)
