[<- Back to summary](summary.md)

# Orphaned Integ Tests

#### [b497a376ca20c1f5](../../packages/integration-tests/__tests__/defined-behavior/1-patterns/start/manual-installation.ts#9)

##### [`../../packages/integration-tests/__tests__/defined-behavior/1-patterns/start/manual-installation.ts#9`](../../packages/integration-tests/__tests__/defined-behavior/1-patterns/start/manual-installation.ts#9)

~~~
    // #region covers b497a376ca20c1f5
    // Note: A schema cannot be empty.
    const schema = a.schema({
Todo: a
  .model({
    content: a.string(),
    isDone: a.boolean(),
  })
  .authorization((allow) => [allow.publicApiKey()]),
    });
    type Schema = ClientSchema<typeof schema>;
    // #endregion
~~~

---

[<- Back to summary](summary.md)
