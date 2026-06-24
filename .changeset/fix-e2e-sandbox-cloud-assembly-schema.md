---
---

Fix the `e2e-sandbox` CDK cloud-assembly-schema v54 mismatch introduced by the
`aws-cdk-lib` security bump, and complete the Dependabot remediation.

`aws-cdk-lib >= 2.258.0` ships `@aws-cdk/cloud-assembly-schema` v54, but the Amplify
sandbox deployer bundled with `@aws-amplify/backend-cli` supports cloud-assembly-schema
up to `53.x.x` only. Floating `^2.246.0` to the latest `2.260.0` therefore made
`ampx sandbox` synth emit a v54 manifest the deployer could not read. `aws-cdk-lib` is
pinned to `2.257.0` — the highest patched (`>= 2.246.0`, GHSA-999r-qq7v-r334) version
that still emits cloud-assembly-schema `<= 53` — across the private `e2e-tests`
workspaces. Root Yarn `resolutions` are also updated to close the remaining open alerts
(`js-yaml` GHSA-h67p-54hq-rp68, `webpack-dev-server` GHSA-mx8g-39q3-5c79,
`http-proxy-middleware` GHSA-64mm-vxmg-q3vj).

Changes are limited to private `e2e-tests` workspace devDependencies, root
`resolutions`, and the lockfile. No published package (`@aws-amplify/data-schema`,
`@aws-amplify/data-schema-types`) changed its source, runtime dependencies, or public
API (`check:api` reports zero delta), so no release is required.
