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

## [Known Issue] Jest open handles warning

Tests that use `Hub` currently emit the following warning when running the tests:

```bash
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
```

The problem seems to be related to Amplify Core's `detectFramework` function, and
is likely due to the fact that we are running the tests in Node (which is not
officially supported by `amplify-js`).

TODO: Investigate and/or fix.

## Sandbox testing:

**Note: trimmed down to essentials (we aren't testing the CLI here)**

1. `await ampxCli`

- Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI

### Build stuff

Problem using execa with Jest in Node. ESM import issue. Tried a few config options, but no luck. They don't use Jest, so no help here.

- https://github.com/sindresorhus/execa/issues/465
- https://jestjs.io/docs/ecmascript-modules

Workaround is to use a newer version of execa than amplify-backend, but the usage needs some adjustments.
