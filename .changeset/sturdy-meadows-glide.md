---
'@aws-amplify/data-schema': minor
---

`ClientSchema` now accepts a second generic for compile-time configuration:

```ts
type Schema = ClientSchema<typeof schema, { selectionSetDepth: N }>;
```

`selectionSetDepth` controls how many relationship hops are inlined in the
`flatModel` used for custom selection set type generation:

- `0` keeps relationships as `LazyLoader`s, no `.*` paths into them
- `1`–`4` expose progressively more relationship hops in `selectionSet`
- `5` (default) matches prior behavior

Lower values reduce TypeScript instantiations and serve as an opt-in escape
for schemas hitting TS2590 on dense bidirectional relationships.
