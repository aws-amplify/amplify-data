# Benchmarks

## Getting Started

#### Running an individual bench file

This script will build the `data-schema` and `data-schema-types` packages, then run the specified bench file.

```
$ npm run bench:file file_name
```

#### Running groups of benches

These scripts will build the packages in the library, then run all the bench files in the specified directory.

```
$ npm run bench:patterns
$ npm run bench:basic
$ npm run bench:p50
$ npm run bench:p99
$ npm run bench:all
```

#### Creating a new bench

Add the following block to an existing bench file or a new file (use extension `.bench.ts` in the file name)

```ts
bench('new bench', () => {
  // do some typey stuff
  type Generic<T> = T;
  type _Test = Generic<string>;
}).types();
```

Then run `npm run bench:file file_name` and the instantiation count will appear in the file inside the `.types()` builder.

```ts
bench('new bench', () => {
  type Generic<T> = T;
  type _Test = Generic<string>;
}).types([1, 'instantiations']);
```

The value will serve as the baseline for subsequent runs.

#### Re-baselining existing bench

If you've made changes to the library that impacted type performance and you want to create a new baseline, run:

```
$ npm run baseline file_name
```

(The `baseline` scripts also first build the packages in the library before executing)

Similarly, you can do this in groups (by directory):

```
$ npm run baseline:patterns
$ npm run baseline:basic
$ npm run baseline:p50
$ npm run baseline:p99
$ npm run baseline:all
```

## Overview of existing benchmarks:

Note: Schemas are hardcoded (i.e. not generated with loops) because loops are:

- not representative of real-world usage, and
- not representative of real-world performance (dynamically generated schema
  benchmarks do not match "hard-coded" schemas.

Additionally, there is no way to re-use schema instantation (e.g. a helper function
called by each benchmark to avoid repeating the schema in each test), as this
changes the instantiation count output.

### patterns

This folder demonstrates the baseline performance various typing patterns like maps,
merging, conditional types, inferred types, and other combinations of patterns we
use in this repository.

When trying new patterns or approaching refactors, it's a good idea to create a new
pattern here to demonstrate how it works and what hows its performance compares to
other patterns.

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

| Schema Benchmark | Instantiations | w/ client types | w/ CRUDL   | w/ SELECTION SET |
| ---------------- | -------------- | --------------- | ---------- | ---------------- |
| p50              | 32,110         | 233,973         | 3,050,506  | 3,111,497        |
| p50 (prod)       | 134,175        | 4,568,413       | 17,791,120 | 17,988,303       |

### p99 ("over limit")

_Note: We do not currently have benchmarks for CRUDL operations / selection sets
for these schemas._

| Schema Benchmark    | Instantiations | w/ client types | w/ CRUDL           | w/ SELECTION SET   |
| ------------------- | -------------- | --------------- | ------------------ | ------------------ |
| p99 (tall, complex) | 1,200,522      | 10,867,462      | TODO (pending fix) | TODO (pending fix) |
| p99 (tall, simple)  | 3,212,284      | 14,274,960      | TODO (pending fix) | TODO (pending fix) |
| p99 (wide, large)   | 1,239,660      | 11,231,864      | TODO (pending fix) | TODO (pending fix) |

### p99 ("within limit")

| Schema Benchmark   | Instantiations | w/ client types | w/ CRUDL           | w/ SELECTION SET   |
| ------------------ | -------------- | --------------- | ------------------ | ------------------ |
| p99 (tall, simple) | 166,349        | 5,674,827       | 6,766,437          | 7,186,893          |
| p99 (wide, large)  | 800,936        | 9,031,063       | TODO (pending fix) | TODO (pending fix) |
| P99 (wide, small)  | 234,876        | 956,859         | 1,670,961          | 1,803,880          |
