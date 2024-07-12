# WIP E2E samples

This package contains automated tests that share a single Node app for validating
functionality E2E.

## How it works:

- The code to be tested E2E exists in files in `test-cases`
  - Each test case has an `action` function that returns a boolean
  - Test utils pass the generated client to `action`
- Amplify is automatically configured prior to each test suite run
- All test suites share a single Amplify backend

## [WIP] How to add a new test:

1. Create a new file in the `./testCases` folder
2. Add test cases that follow this pattern and return a boolean
3. Add spec that imports the new test cases, use existing utils

## [WIP] How to watch local changes and re-run tests:

- At the root of the monorepo, run `npm run build:watch` (`npm run turbo watch` for now)
