# WIP E2E samples

This package contains automated tests that share a single Node app for validating
our functionality E2E.

## WIP Notes:

- `tsx`
  - primary testing happens here.
- `amplify-next-pages-template`
  - a fork of the repo used in our Getting Started docs, uses Next.
- `vite-node-e2e-sample`
  - uses `vite-node` to compile.
  - potential path for test a Vite config file, but without other Cypress, etc.
- How we do it:
  - shared backend for all E2E tests.
  - Move jest deps + tests?

# [WIP] How to add a new test:

1. Create component
2. Add test cases that follow this pattern and return a boolean
3. Add spec that imports testCases and uses utils
