# E2E Test Coverage

The following table outlines the current e2e test coverage for various runtimes and environments in our project:

| Runtime/Environment | Status                                             |
| ------------------- | -------------------------------------------------- |
| Chrome              | [✅](.github/workflows/callable-e2e-test.yml)      |
| Node                | [✅](packages/e2e-tests/node/jest.config.ts)       |
| Webpack             | [✅](packages/e2e-tests/webpack/webpack.config.js) |
| Rollup              | ⚠️                                                 |
| Metro               | ⚠️                                                 |
| React Natives       | ⚠️                                                 |
| Vite                | [✅] (packages/e2e-tests/vite/vite.config.ts)      |

Legend:

- ✅ Fully covered by e2e tests
- ⚠️ In progress
- N/A Not applicable or not planned

## Notes

- Click on the icons in the table to view relevant e2e test configurations or workflows.
