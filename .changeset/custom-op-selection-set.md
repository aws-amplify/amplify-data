---
'@aws-amplify/data-schema': minor
---

Custom queries, mutations and subscriptions that return a model ref now accept `selectionSet`, with the same paths, depth and result shape as model operations.

```ts
const { data } = await client.queries.getFeaturedPost(
  { slug: 'hello' },
  { selectionSet: ['id', 'title', 'comments.*'] },
);
```
