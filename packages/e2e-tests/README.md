# `amplify-api-next` E2E Tests

This package contains automated tests for validating functionality E2E in Node.

## How it works:

- All tests within `node` share a single "long-lived" Amplify backend (added to
  the shared Cypress account).
- Sample will use `amplify-js@unstable` and local versions of packages in this repo.
- See [test utils](node/utils.ts) for helpers that configure Amplify, generate /
  configure the API client, as well as for additional test utilities and types.

## How to add a new test / test local changes:

1. Create a new file under `__tests__`
2. Use the helpers to configure Amplify and generate / configure the API client.
3. To install dependencies / run the tests, either use the `e2e` scripts at
   the root of the monorepo, or the scripts in the `e2e-tests` package. Both will
   ensure that a `package-lock` file is not generated for this sample.
4. [TODO] subscription testing (will be added with follow-up PR)

## [TODO] Global cleanup

Add a check to clean up potential orphaned records after all tests have run
(see https://jestjs.io/docs/configuration#globalteardown-string).
