# Standard Operating Procedures

This document exists to capture specific types of work related to maintaining this project. Relative to the [contributing guide](CONTRIBUTING.md), which provides general instruction on contributing to the repository, this document captures specific narrow usecase instructions.

## Missing exports

Projects that use this library, but are built with declarations (`"declaration": true` in the project `tsconfig.json`) which build `*.d.ts` files for the library may run into the following error:

```
The inferred type of applicationFeatureName cannot be named without a reference to '../node_modules/@aws-amplify/data-schema/dist/esm/FileName'. This is likely not portable. A type annotation is necessary.
```

This error tells you which file has a missing export, but not which specific export is needed. To resolve this:

1. Review the `applicationFeatureName` library usage and add it to an example in the [exports-test](packages/e2e-tests/exports-test/src/index.ts) and run `npm run test` to confirm that you change breaks the test build as you expect.
1. Add `export * from './FileName'` to the [library index](packages/data-schema/src/index.ts) and run `npm run build && npm run test` to confirm that this fixes the error.
1. Now review the `exports` from `./FileName`, replacing the `*` with a list of all of the exported types `export type { ... } from './FileName';`
1. With all exports re-exported, `npm run build && npm run test` should fix the test application. Experiment removing imports and rerunning this test command until you have the minimum set of required exports to resolve the build issue under test.
1. For each type exported by your change, add the following comments/docs.
