# Contributing Guidelines

Thank you for your interest in contributing to our project. Whether it's a bug report, new feature, correction, or additional
documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary
information to effectively respond to your bug report or contribution.

## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure somebody else hasn't already
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

- A reproducible [test case](TESTING-STRATEGY.md) or series of steps
- The version of our code being used
- Any modifications you've made relevant to the bug
- Anything unusual about your environment or deployment

## Finding contributions to work on

Looking at the existing issues is a great way to find something to contribute on. As our projects, by default, use the default GitHub issue labels (enhancement/bug/duplicate/help wanted/invalid/question/wontfix), looking at any 'help wanted' issues is a great place to start.

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the _main_ branch.
1. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
1. **You open an issue to discuss any significant work - we would hate for your time to be wasted.**

To send us a pull request, please:

1. Fork the repository.
1. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
1. Create a changeset with `npx changeset` (see [Creating changesets](CONTRIBUTING.md#creating-changesets) for details)
1. Ensure all local automated tests and checks pass (`npm run check`).
1. Commit to your fork using clear commit messages. [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) are preferred.
1. Send us a pull request, answering any default questions in the pull request template.
1. Pay attention to any automated CI failures reported in the pull request, and stay involved in the conversation.

GitHub provides additional document on [forking a repository](https://help.github.com/articles/fork-a-repo/) and
[creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

### Creating changesets

This repo uses changesets for versioning and releasing changes.

All changes that affect release artifacts must have a corresponding changeset. To create a changeset run `npx changeset`. This will start a walkthrough to author the changeset file. This file should be committed to the repo.

### Other helpful scripts

`npm run check:type-perf` will let you know if your changes are passing typescript benchmark limits

`npm run vend` will start a local npm proxy and publish the local packages to this proxy so they can be installed / used as if they were published on npm

`npm run e2e` will run the E2E test suite.

### E2E tests

See the [e2e-tests README](packages/e2e-tests/README.md) for more information.

### Publishing packages locally

Publishing packages locally allows you to install local package changes as if they were published to NPM. This can be useful for testing or demo scenarios.

To set up a local npm proxy and publish the current local state to the proxy, run `npm run vend`.
This will start a local npm proxy using [Verdaccio](https://verdaccio.org/) and run `changeset version` and `changeset publish`.

This will also point your local npm config to the local npm proxy. At this point you can npm install any packages in the repo and it will pull from the local proxy instead of directly from npm.

To stop the local server and reset your npm registry run `npm run stop:npm-proxy`.

To clear the proxy package cache run `npm run clean:npm-proxy`. This will stop the local proxy and remove all packages you have published.

To start the npm proxy without immediately publishing, run `npm run start:npm-proxy`.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
