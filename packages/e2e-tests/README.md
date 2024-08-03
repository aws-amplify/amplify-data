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

All tests within the `sandbox` directory deploy a new sandbox for each test run.

## How it works:

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

Since we deploying a fresh sandbox on each test run, we need AWS credentials accessible to the GitHub Actions workflow. Below is an overview of the setup:

- We follow the recommended integration to get AWS account credentials: https://w.amazon.com/bin/view/Open_Source/GitHub/Actions.

  - Uses the [GitHub Actions OIDC integration](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services).
  - We use the [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials#assuming-a-role) to obtain credentials from the IAM OIDC provider.

- The CLI commands pick up credentials using the default credential provider which resolves to the env vars that the `configure-aws-credentials` GitHub Action sets [here](https://github.com/aws-amplify/amplify-backend/blob/f5eeb67d840a194ffeeb585bfa0ba9468c1f6cda/.github/workflows/health_checks.yml#L213-L217)

#### IAM trust policy restrictions

- Currently, the trust policy for the OIDC provider is set to only allow execution of the `main` branch on `amplify-api-next`, since there are protections on this branch. If we want to run tests on other branches, we could update the trust policy to be restricted on an repo environment.
- Permissions policy is limited to `AmplifyBackendDeployFullAccess`

To view identify provider: Console > IAM > Identity providers, `token.actions.githubusercontent.com`.

IAM > Roles > search for `api-next-e2e-sandbox`, and examine the `Trust Relationship` configuration, where you'll note the scope is to our repo only / the main branch.

Role: `api-next-e2e-sandbox`.

#### How this differs from backend:

- Separately, they have an AWS profile that contains additional test harness permissions which is configured [here](https://github.com/aws-amplify/amplify-backend/blob/f5eeb67d840a194ffeeb585bfa0ba9468c1f6cda/.github/workflows/health_checks.yml#L207-L212) and then gets loaded into various clients eg [here](https://github.com/aws-amplify/amplify-backend/blob/f5eeb67d840a194ffeeb585bfa0ba9468c1f6cda/packages/integration-tests/src/test-project-setup/cdk/test_cdk_project_creator.ts#L30)

- Short summary is that we want all npx ampx command to use a role that only has AmplifyBackendDeployFullAccess policy, so we can catch if we introduce anything that would require change of that policy.
- However, our test code requires more permissions (for setup or cleanup). That’s why we use different set of credentials for that which might have more permissive policies.
- See [this PR](https://github.com/aws-amplify/amplify-backend/pull/768) for more details and implementation.
- For more information about backend team’s e2e credentials here: https://quip-amazon.com/MzORADiHsLYf/amplify-backend-Repo-Ops-and-Internal-Dev-Workflows#temp:C:fHXb6180a4842dd485fa8902abf3

- Since we are not testing sandbox functionality directly, and are only concerned with the schema builder, this fine-grained access is unncessary. Explaining here for context, as [TODO explain]

#### Other credential implementation details:

The CLI commands pick up credentials using the default credential provider which resolves to the env vars that the configure-aws-credentials GH action sets here.

Separately, they have an AWS profile that contains additional test harness permissions which is configured here and then gets loaded into various clients eg here.

#### Resources:

- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html

## How to add a new test:

1. Add a new project directory under `amplify-backends`. Must also contain a
   basic `package.json`.
2. Add a corresponding test file under `__tests__`.
3. Use the utils to generate / teardown the sandbox withthe process controller.

## Job to destroy orphaned sandboxes

- Backend team uses this https://github.com/aws-amplify/amplify-backend/blob/main/scripts/cleanup_e2e_resources.ts to destroy orphaned sandboxes.
- This is run in the e2e test account here https://github.com/aws-amplify/amplify-backend/actions/workflows/e2e_resource_cleanup.yml
- It can also be used to purge resources from personal AWS accounts.

## Using Execa with Jest

Execa is the primary dependency used to run CLI commands in the process
controller, and it is a pure ES module. Unlike `amplify-backend`, which uses the
Node test runner, our tests are written in Jest. This results in [this issue](https://github.com/sindresorhus/execa/issues/465).
The workaround is to use Jest's [experimental support for ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules). There is a backlog item to investigate other potential solutions.
