# exports-test

## 1.0.1

### Patch Changes

- caf5695: Hoist `typescript` to a single root devDependency (removed from every workspace
  package) and declare `"types": ["node", "jest"]` in
  `packages/data-schema/tsconfig.json`, which TypeScript 6+ requires now that
  `types` defaults to `[]`. Lets the TypeScript canary type-check the published
  declarations with the exact TypeScript version it installs. No runtime, type, or
  public API change (`check:api` reports zero delta).
