[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/

Coverage: 100.0%

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Member: a.model({
  name: a.string().required(),
  // 1. Create a reference field
  teamId: a.id(),
  // 2. Create a belongsTo relationship with the reference field
  team: a.belongsTo("Team", "teamId"),
}),

Team: a.model({
  mantra: a.string().required(),
  // 3. Create a hasMany relationship with the reference field
  //    from the `Member`s model.
  members: a.hasMany("Member", "teamId"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `0d0ad5f8c1b991de` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L22)

---

#### `Unnamed Snippet`

~~~
const { data: team } = await client.models.Team.create({
  mantra: "Go Frontend!",
});

const { data: member } = await client.models.Member.create({
  name: "Tim",
  teamId: team.id,
});

~~~

| | |
| -- | -- |
| Hash | `dc7d0a1a6d72510a` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L81)

---

#### `Unnamed Snippet`

~~~
const { data: newTeam } = await client.models.Team.create({
  mantra: "Go Fullstack",
});

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: newTeam.id,
});

~~~

| | |
| -- | -- |
| Hash | `06214f3775b02364` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L135)

---

#### `Unnamed Snippet`

~~~
await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: null,
});

~~~

| | |
| -- | -- |
| Hash | `f2ae6e917b0bc1b2` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L176)

---

#### `Unnamed Snippet`

~~~
const { data: team } = await client.models.Team.get({ id: "MY_TEAM_ID" });

const { data: members } = await team.members();

members.forEach((member) => console.log(member.id));

~~~

| | |
| -- | -- |
| Hash | `b02d88e15c6256e8` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L225)

---

#### `Unnamed Snippet`

~~~
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "MY_TEAM_ID" },
  { selectionSet: ["id", "members.*"] },
);

teamWithMembers.members.forEach((member) => console.log(member.id));

~~~

| | |
| -- | -- |
| Hash | `ae43c44bff14af30` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L277)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Cart: a.model({
  items: a.string().required().array(),
  // 1. Create reference field
  customerId: a.id(),
  // 2. Create relationship field with the reference field
  customer: a.belongsTo("Customer", "customerId"),
}),
Customer: a.model({
  name: a.string(),
  // 3. Create relationship field with the reference field
  //    from the Cart model
  activeCart: a.hasOne("Cart", "customerId"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `3807e61bd96dc4fe` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L354)

---

#### `Unnamed Snippet`

~~~
const { data: customer, errors } = await client.models.Customer.create({
  name: "Rene",
});

const { data: cart } = await client.models.Cart.create({
  items: ["Tomato", "Ice", "Mint"],
  customerId: customer?.id,
});

~~~

| | |
| -- | -- |
| Hash | `c866224db025011b` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L411)

---

#### `Unnamed Snippet`

~~~
const { data: newCustomer } = await client.models.Customer.create({
  name: "Ian",
});

await client.models.Cart.update({
  id: cart.id,
  customerId: newCustomer?.id,
});

~~~

| | |
| -- | -- |
| Hash | `33c181d03567d778` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L475)

---

#### `Unnamed Snippet`

~~~
await client.models.Cart.update({
  id: project.id,
  customerId: null,
});

~~~

| | |
| -- | -- |
| Hash | `01f88137bf80d2f9` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L543)

---

#### `Unnamed Snippet`

~~~
const { data: cart } = await client.models.Cart.get({ id: "MY_CART_ID" });
const { data: customer } = await cart.customer();

~~~

| | |
| -- | -- |
| Hash | `c5f4e8bcdb208fdd` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L595)

---

#### `Unnamed Snippet`

~~~
const { data: cart } = await client.models.Cart.get(
  { id: "MY_CART_ID" },
  { selectionSet: ["id", "customer.*"] },
);

console.log(cart.customer.id);

~~~

| | |
| -- | -- |
| Hash | `edb23d7db6fb10cb` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L692)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
PostTag: a.model({
  // 1. Create reference fields to both ends of
  //    the many-to-many relationship
  postId: a.id().required(),
  tagId: a.id().required(),
  // 2. Create relationship fields to both ends of
  //    the many-to-many relationship using their
  //    respective reference fields
  post: a.belongsTo("Post", "postId"),
  tag: a.belongsTo("Tag", "tagId"),
}),
Post: a.model({
  title: a.string(),
  content: a.string(),
  // 3. Add relationship field to the join model
  //    with the reference of `postId`
  tags: a.hasMany("PostTag", "postId"),
}),
Tag: a.model({
  name: a.string(),
  // 4. Add relationship field to the join model
  //    with the reference of `tagId`
  posts: a.hasMany("PostTag", "tagId"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `dce6a76edb6ca8c8` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L17)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Post: a.model({
  title: a.string().required(),
  content: a.string().required(),
  authorId: a.id(),
  author: a.belongsTo("Person", "authorId"),
  editorId: a.id(),
  editor: a.belongsTo("Person", "editorId"),
}),
Person: a.model({
  name: a.string(),
  editedPosts: a.hasMany("Post", "editorId"),
  authoredPosts: a.hasMany("Post", "authorId"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `0d2b1e843c6bf398` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L717)

---

#### `Unnamed Snippet`

~~~
const client = generateClient<Schema>();

const { data: post } = await client.models.Post.get({ id: "SOME_POST_ID" });

const { data: author } = await post?.author();
const { data: editor } = await post?.editor();

~~~

| | |
| -- | -- |
| Hash | `3ff516f1c240d2e3` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L767)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Post: a.model({
  title: a.string().required(),
  content: a.string().required(),
  // Reference fields must correspond to identifier fields.
  authorName: a.string(),
  authorDoB: a.date(),
  // Must pass references in the same order as identifiers.
  author: a.belongsTo("Person", ["authorName", "authorDoB"]),
}),
Person: a
  .model({
    name: a.string().required(),
    dateOfBirth: a.date().required(),
    // Must reference all reference fields corresponding to the
    // identifier of this model.
    authoredPosts: a.hasMany("Post", ["authorName", "authorDoB"]),
  })
  .identifier(["name", "dateOfBirth"]),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `b7d6f1236e4afce6` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L787)

---

#### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Post: a.model({
  title: a.string().required(),
  content: a.string().required(),
  // You must supply an author when creating the post
  // Author can't be set to `null`.
  authorId: a.id().required(),
  author: a.belongsTo("Person", "authorId"),
  // You can optionally supply an editor when creating the post.
  // Editor can also be set to `null`.
  editorId: a.id(),
  editor: a.belongsTo("Person", "editorId"),
}),
Person: a.model({
  name: a.string(),
  editedPosts: a.hasMany("Post", "editorId"),
  authoredPosts: a.hasMany("Post", "authorId"),
}),
  })
  .authorization((allow) => allow.publicApiKey());

~~~

| | |
| -- | -- |
| Hash | `433fee752f917db8` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/modeling-relationships.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/modeling-relationships.ts#L836)

---

[<- Back to index](../../../../../../docs-pages.md)
