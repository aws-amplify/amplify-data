This package contains automated tests for validating the integration between the schema builder and client at the type system level only.
Runtime tests will continue to live with the API-GraphQL category of `aws-amplify`

See [TESTING-STRATEGY.md](../../TESTING-STRATEGY.md) for definitions of sub-categories
found in `defined-behavior` tests.

## Notes:

- Folder structure matches docs urls
- Contains exact snippets from docs
- Where applicable, links to existing expected / exhaustive tests that cover the
  respective functionality.

## Docs Test Coverage

The following table represents "yes/no" to highlight what is tested at a high-level. Some functionality is tested more extensively
in `expected-use`, `exhaustive`, or E2E. For specific details on where specific functionality is tested, as well as links
to the docs code snippets, see linked READMEs below:

- `01-quickstart`
  - [x] [01-quickstart/01-next-js-app-router-client-components](./__tests__/defined-behavior/1-patterns/01-quickstart/01-nextjs-app-router-client-components/README.md)
  - [x] [01-quickstart/02-next-js-app-router-server-components](./__tests__/defined-behavior/1-patterns/01-quickstart/02-nextjs-pages-router/README.md)
