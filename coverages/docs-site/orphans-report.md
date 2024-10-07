[<- Back to summary](readme.md)

# Orphaned Integ Tests

#### [e2f15d81cee3ec1a,](../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#15)

##### [`../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#15`](../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#15)

~~~
// #region covers e2f15d81cee3ec1a,
const schema = a.schema({
  Post: a
    .model({
content: a.string(),
    })
    .authorization((allow) => [
// Allow anyone auth'd with an API key to read everyone's posts.
allow.publicApiKey().to(['read']),
// Allow signed-in user to create, read, update,
// and delete their __OWN__ posts.
allow.owner(),
    ]),
});
// #endregion
~~~

---

[<- Back to summary](readme.md)
