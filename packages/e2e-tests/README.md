# `amplify-api-next` E2E Tests

This package contains automated tests for validating functionality E2E.

## How it works:

- Includes minimal Jest setup/teardown - less focus on test code, more focus on
  the code to be tested.
- Tested functionality exists under `test-cases`
  - Each test case has an `action` function that returns a boolean. Test success
    / failure is determined by this value.
  - Test utils pass the generated client to `action`.
  - Test cases include `setup` (executed before the test case) and `teardown`
    (executed after the test case).
- All test suites currently share a single Amplify backend.

## How to add a new test:

1. Create a new file under `test-cases`
2. Test cases are typed - you'll know if you're not following the contract.
3. Add your newly added test cases to `test-cases/index.ts`.
4. New test cases will be automatically picked up by the test runner, and run
   in the pipeline (see `.github/workflows/callable-local-e2e-tests.yml`)

## [TODO] Global cleanup

Add a check to clean up potential orphaned records after all tests have run (see https://jestjs.io/docs/configuration#globalteardown-string).
