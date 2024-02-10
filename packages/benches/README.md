# Benchmarks

## Getting Started

To run benches:

```
$ npm run bench
```

To create a new bench:

```ts
bench('new bench', () => {
  // do some typey stuff
}).types();
```

Then run `npm run bench` and the instantiation count will appear in the file inside the `.types()` builder.

```ts
bench('new bench', () => {
  // do some typey stuff
}).types([0, 'instantiations']);
```

The value will serve as the baseline for subsequent runs.

If you want to re-baseline the benches, clear the value inside the builder (`.types()`)

## Overview of existing benchmarks:

Note: Schemas are hardcoded (i.e. not generated with loops) because loops are:

- not representative of real-world usage, and
- not representative of real-world performance (dynamically generated schema
  benchmarks do not match "hard-coded" schemas.

Additionally, there is no way to re-use schema instantation (e.g. a helper function
called by each benchmark to avoid repeating the schema in each test), as this
changes the instantiation count output.

### p50

- `p50` schemas were designed to match guidance from our Product team around
  the estimated size and complexity of typical `p50` schemas. There are two
  variations: 1) the "actual" `p50` schema, meant to represent most customer
  use-cases, and 2) a "production" `p50` schema, meant to represent larger,
  brownfield apps in production.
- Our assumption around what is a `p50`` is: 3 models, 5 fields each, all
  connected with relationships, 2 auth rules, and at least 1 field-level auth
  rule.
- Our assumption around what is a prod-level "p50" is approximately 25 models
  with 10 fields each, 80% of models contain connections, with a mix of auth
  rules and identifiers.

### p99

- `p99` schemas were designed to match high-level AppSync schema-size metrics
  (i.e. real-world, production-level schema sizes).
- There are several permutations of large, production-level schemas. Permutations
  include "tall" schemas (many models with fewer fields), and "wide" schemas
  (fewer models with many fields). Each permutation roughly corresponds to
  real-world schema sizes in production.
- "Simple" models have no connections, and only global public auth rules.

## Known limitations

### Type instantiation limits

Some of our larger schemas are hitting TypeScript's type instantiation limits:

`ERROR: Type instantiation is excessively deep and possibly infinite`

As a result, there are two folders: `over-limit`, and `within-limit`.

`within-limit` schemas are just below the threshold for generating this error.
These have been included so we can identify future regressions that would cause
smaller schemas to hit this limit early.

`over-limit` schemas exceed this limit in order to match real-world metrics, and
the TypeScript error has been ignored. We do not currently have benchmarks for
CRUDL operations / selection sets for these schemas.

### CloudFormation limits

https://github.com/aws-amplify/amplify-category-api/issues/2189

When working with large schemas it is common to get throttled by CloudFormation:

```bash
The CloudFormation deployment has failed. Find more information in the CloudFormation
AWS Console for this stack. Caused By: ❌ Deployment failed: Error: The stack named
[STACK NAME] failed to deploy: UPDATE_ROLLBACK_COMPLETE: Received response status
[FAILED] from custom resource. Message returned: Rate exceeded
```

The current workaround is to update the schema iteratively, and waiting for each
deployment to succeed before updating the schema.

## Benchmark values as of 2/6/2024:

### p50

| Schema Benchmark | Instantiations | w/ client types | w/ CRUDL  | w/ SELECTION SET |
| ---------------- | -------------- | --------------- | --------- | ---------------- |
| p50              | 20,578         | 460,912         | 3,050,506 | 3,111,497        |
| p50 (prod)       | 54,314         | 4,539,404       | 8,440,504 | 17,988,303       |

### p99 ("over limit")

_Note: We do not currently have benchmarks for CRUDL operations / selection sets
for these schemas._

| Schema Benchmark    | Instantiations | w/ client types | w/ CRUDL           | w/ SELECTION SET   |
| ------------------- | -------------- | --------------- | ------------------ | ------------------ |
| p99 (tall, complex) | 467,767        | 8,919,415       | TODO (pending fix) | TODO (pending fix) |
| p99 (tall, simple)  | 928,191        | 8,339,803       | TODO (pending fix) | TODO (pending fix) |
| p99 (wide, large)   | 24,712         | 9,867,387       | TODO (pending fix) | TODO (pending fix) |

### p99 ("within limit")

| Schema Benchmark   | Instantiations | w/ client types | w/ CRUDL           | w/ SELECTION SET   |
| ------------------ | -------------- | --------------- | ------------------ | ------------------ |
| p99 (tall, simple) | 48,415         | 2,573,418       | 3,326,571          | 3,511,380          |
| p99 (wide, large)  | 19,231         | 8,152,084       | TODO (pending fix) | TODO (pending fix) |
| P99 (wide, small)  | 3,423          | 800,034         | 5,991,877          | 6,493,245          |
