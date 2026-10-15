# tsc-compliance

## 1.0.3

### Patch Changes

- caf5695: Hoist `typescript` to a single root devDependency (removed from every workspace
  package) and declare `"types": ["node", "jest"]` in
  `packages/data-schema/tsconfig.json`, which TypeScript 6+ requires now that
  `types` defaults to `[]`. Lets the TypeScript canary type-check the published
  declarations with the exact TypeScript version it installs. No runtime, type, or
  public API change (`check:api` reports zero delta).
- Updated dependencies [caf5695]
  - @aws-amplify/data-schema@1.26.3

## 1.0.2

### Patch Changes

- 4f01eb9: chore: migrate from npm to yarn 4 with eslint 9 upgrade
- Updated dependencies [e629c5c]
- Updated dependencies [8ced0c0]
  - @aws-amplify/data-schema@1.25.4

## 1.0.1

### Patch Changes

- f72a036: fix: bump aws-cdk-lib dependency
