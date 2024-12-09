# Supported Runtimes and Build Tools

The following table outlines the current support status for various runtimes and environments in our project:

| Runtime/Environment | Status |
|---------------------|-----------|
| Chrome           | [✅](.github/workflows/callable-e2e-test.yml) | 
| Node             | [✅](packages/e2e-tests/node/jest.config.ts) | 
| Webpack                |    	⚠️     | 
| Rollup                 | 	⚠️        |
| Metro                    | 	⚠️      |
| React Natives            | 	⚠️      |

Legend:
- ✅ Fully supported and tested
- ⚠️ Partial support or in progress
- N/A Not applicable or not planned for support

## Notes

- Click on the icons in the table to view relevant tests or configuration files.
- We are actively working on expanding our coverage for environments marked with ⚠️.
- If you need support for an unlisted environment, please open an issue in our repository.

