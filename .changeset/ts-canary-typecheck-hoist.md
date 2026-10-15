---
"@aws-amplify/data-schema": patch
"@aws-amplify/data-schema-types": patch
"tsc-compliance": patch
"exports-test": patch
"@aws-amplify/e2e-node-tests": patch
"@aws-amplify/e2e-sandbox-tests": patch
"@aws-amplify/e2e-vite-tests": patch
"@aws-amplify/e2e-webpack-tests": patch
---

Hoist `typescript` to a single root devDependency (removed from every workspace
package) and declare `"types": ["node", "jest"]` in
`packages/data-schema/tsconfig.json`, which TypeScript 6+ requires now that
`types` defaults to `[]`. Lets the TypeScript canary type-check the published
declarations with the exact TypeScript version it installs. No runtime, type, or
public API change (`check:api` reports zero delta).
