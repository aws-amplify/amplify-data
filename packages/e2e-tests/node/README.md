# Node E2E Test

This e2e test relies on a long-lived cloud backend provisioned in the team's internal AWS account.

The `amplify_outputs.json` file is not persisted to the repo. The contents of the `amplify_outputs.json` file are base64-encoded and stored in a GitHub Actions secret. The GHA job creates a temporary `amplify_outputs.json` from the secret during execution.

The decoded config is stored in SSM in the team's internal AWS account.

## Running the test locally

1. Get `amplify_outputs.json` contents from team SSM and save to a file with that name in this directory
1. `npm run install:no-lock`
1. `npm run e2e-node` to run test

Note: `amplify_outputs.json` files are ignored by Git in this directory, so you do not have to delete them manually.

## Updating backend

Prereqs:

- `gh` CLI installed and configured with your GitHub credentials (`brew install gh && gh auth login`)
- amplify-backend profile configured with the team's internal AWS test account

See GitHub Actions [docs](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#storing-base64-binary-blobs-as-secrets) for similar configuration.

Steps:

1. Create a new amplify-backend sandbox in this directory using an AWS profile configured with our internal AWS test account credentials
1. After sandbox deploys, ensure the generated `amplify_outputs.json` contains the expected configuration
1. Run `base64 -i amplify_outputs.json -o amplify_outputs.base64` to output a base64-encoded config
1. Run `gh secret set E2E_NODE_AMPLIFY_OUTPUTS_BASE64 < amplify_outputs.base64` to set the secret to the base64-encoded value
1. Trigger e2e workflow to confirm the test script works as expected with your new backend.
   - **If you're seeing errors and would like to revert to the last known working config: retrieve `amplify_outputs.json` from team's SSM, base64-encode it, and set as secret value. Trigger test run to confirm.**
   - If new config works as expected, update SSM with the new config you created. Use the un-encoded JSON contents (direct copy-paste from your `amplify_outputs.json` file)

Note: `amplify_outputs.json` and `amplify_outputs.base64` files are ignored by Git in this directory, so you do not have to delete them manually.
