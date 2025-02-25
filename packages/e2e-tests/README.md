# `amplify-data` E2E Tests

## Node testing

This package contains automated tests for validating functionality E2E in Node.

### How it works:

- All tests within `node` share a single "long-lived" Amplify backend (added to
  the shared Cypress account).
- Sample will use `amplify-js@unstable` and local versions of packages in this repo.
- See [test utils](node/utils.ts) for helpers that configure Amplify, generate /
  configure the API client, as well as for additional test utilities and types.

### How to add a new test / test local changes:

1. Create a new file under `__tests__`
2. Use the helpers to configure Amplify and generate / configure the API client.
3. To install dependencies / run the tests, either use the `e2e` scripts at
   the root of the monorepo, or the scripts in the `e2e-tests` package. Both will
   ensure that a `package-lock` file is not generated for this sample.
4. [TODO] subscription testing (will be added with follow-up PR)

### [TODO] Global cleanup

Add a check to clean up potential orphaned records after all tests have run
(see https://jestjs.io/docs/configuration#globalteardown-string).

### [Known Issue] Jest open handles warning

Tests that use `Hub` currently emit the following warning when running the tests:

```bash
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
```

The problem seems to be related to Amplify Core's `detectFramework` function, and
is likely due to the fact that we are running the tests in Node (which is not
officially supported by `amplify-js`).

TODO: Investigate and/or fix.

## Sandbox testing:

All tests within the `sandbox` directory deploy a new sandbox for each test run.

### How it works:

CLI commands are managed by the process controller. The process controller is
responsible for executing CLI commands, and listening for output from the CLI.
Test setup / execution is structured as follows:

1. Each test has a corresponding project directory with a particular backend
   config in `amplify-backends`
2. Sandbox is deployed within the corresponding project directory, generating
   `amplify_outputs.json`.
3. Once it is determined that `amplify_outputs.json` is generated, we configure
   Amplify and generate / configure the API client.
4. Tests are executed.
5. Sandbox is torn down after the tests are complete. `.amplify/` and
   `amplify_outputs.json` are deleted.

### CI AWS Credentials:

We follow the recommended OS approach to get AWS account credentials: https://w.amazon.com/bin/view/Open_Source/GitHub/Actions.
Specifically, we use the [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials#assuming-a-role) GH Action to obtain credentials from
the IAM OIDC provider.

### IAM trust policy restrictions for OIDC provider:

Currently, the trust policy for the OIDC provider is set to only allow execution
of the `main` branch on `amplify-data`, since this branch contains appropriate
restrictions to limit E2E runs (test runs only occur when an approved PR has
been merged to `main`).

If we want to extend this policy to allow us to run tests on other branches, we
could update the `Trust Relationship` configuration of the IAM role to be
restricted to a repository environment, instead.

To view identify provider details in the console, see: `Console > IAM > Identity Providers`

### Resources:

- https://w.amazon.com/bin/view/Open_Source/GitHub/Actions
- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
- https://github.com/aws-actions/configure-aws-credentials

### How to add a new test:

1. Add a new project directory under `amplify-backends`. Must also contain a
   basic `package.json`.
2. Add a corresponding test file under `__tests__`.
3. Use the utils to generate / teardown the sandbox withthe process controller.

### Using Execa with Jest

Execa is the primary dependency used to run CLI commands in the process
controller, and it is a pure ES module. Unlike `amplify-backend`, which uses the
Node test runner, our tests are written in Jest. This results in [this issue](https://github.com/sindresorhus/execa/issues/465).
The workaround is to use Jest's [experimental support for ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules). There is a backlog item to investigate other potential solutions.

## General tool testing:

This is the general guidance for testing module bundlers. When testing other tools in the future, please adapt these guidelines accordingly and update this file.

### How to add a new e2e test sample:

1. Add a sample in this directory following the structure `e2e-tests/<framework>`.
2. Add configs for your test to the [local-integ-all.yml](../../.github/integ-config/local-integ-all.yml) file.
3. Create an npm command for your test script and call it from [callable-local-e2e-test](../../.github/workflows/callable-local-e2e-test.yml).
4. Update the e2e test coverage for `amplify-data` repo in [e2e test coverage table](../../e2e-TEST-COVERAGE.md).