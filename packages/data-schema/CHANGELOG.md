# @aws-amplify/data-schema

## 1.9.1

### Patch Changes

- a316ab3: support multiline systemPrompt input for conversation and generation definitions

## 1.9.0

### Minor Changes

- 9e99f59: Implement support for generated (auto-increment) fields using `.default()`.

## 1.8.1

### Patch Changes

- 29f13a4: Expose name, metadata, createdAt, updatedAt in Covnersation Type

## 1.8.0

### Minor Changes

- 6eb40fc: Add conversation delete api, re-organized AiAction enums to align with Amplify-JS"

## 1.7.0

### Minor Changes

- 1d9bd61: Add conversation delete api, re-organized AiAction enums to align with Amplify-JS"

## 1.6.3

### Patch Changes

- 5441ead: Add ability to override user agent with granular actions

## 1.6.2

### Patch Changes

- 8281be2: fix: timestamps in model props breaks runtime

## 1.6.1

### Patch Changes

- 79e8873: fix: Custom operation Ref return works with null/undefined responses

## 1.6.0

### Minor Changes

- adf9f6e: add support for async lambda function handlers

## 1.5.1

### Patch Changes

- b7400b1: fixes result parsing for observeQuery, onCreate, onUpdate, and onDelete operations

## 1.5.0

### Minor Changes

- 6028bf7: Add AI routes to client

## 1.4.1

### Patch Changes

- ed16182: adds selectionSet types to mutation operations

## 1.4.0

### Minor Changes

- 27a0cec: add model .disableOperations() modifier

### Patch Changes

- 2a144f8: fixed cancel behavior for modeled operations

## 1.3.10

### Patch Changes

- f4a47cc: fix subscription filter input types

## 1.3.9

### Patch Changes

- 43c3163: add relationship validation in schema processor

## 1.3.8

### Patch Changes

- 6a5a69c: fix index query support with reqRes client

## 1.3.7

### Patch Changes

- 9b387bc: fix types and handling of enums in custom operation arguments

## 1.3.6

### Patch Changes

- 7175920: allow ownerDefinedIn to reference string-compatible field types

## 1.3.5

### Patch Changes

- aeb07d5: Fix sort key input name for timestamp

## 1.3.4

### Patch Changes

- 193f285: custom selection set return value for custom type array fields

## 1.3.3

### Patch Changes

- 634f87a: fix return types of create, update, delete operations on SSR clients

## 1.3.2

### Patch Changes

- 7add238: fixed infinite recursion on combo of renameModels() and setRelationships()

## 1.3.1

### Patch Changes

- 6f65f4d: Deeper prettification of ClientSchema<...>[ModelName]['type']

## 1.3.0

### Minor Changes

- 73b128b: Internal types perf refactor; Additional ClientSchema types

## 1.2.9

### Patch Changes

- 9bf3b4d: fix[data]: omit unnecessary fields from SQL APIs

## 1.2.8

### Patch Changes

- 2077dd4: fix: nested custom types inherit custom op's auth

## 1.2.7

### Patch Changes

- daff4ed: fix(data): update SchemaProcessor to throw more descriptive errors for Custom Operations

## 1.2.6

### Patch Changes

- 6f9abd0: cleanup

## 1.2.5

### Patch Changes

- 95ba9ee: fix custom operation array of model return type handling

## 1.2.4

### Patch Changes

- db27a4a: fix array property and related model result flattening

## 1.2.3

### Patch Changes

- 66f85e7: fix hasOne lazy loading and other lazy loading edge cases around missing data

## 1.2.2

### Patch Changes

- 5aa23c0: fix: generate correct filter type for non-string fields

## 1.2.1

### Patch Changes

- d6114be: fix composite sk in identifier/secondaryIndex

## 1.2.0

### Minor Changes

- f67cb71: adds addToSchema modifier to imported schemas

## 1.1.6

### Patch Changes

- 4c7eb71: perf optimizations, minor builder refactor
- Updated dependencies [4c7eb71]
  - @aws-amplify/data-schema-types@1.0.1

## 1.1.5

### Patch Changes

- 7b044cf: Updated JS Doc strings for relationships, custom queries, mutations, and subscriptions, and custom types

## 1.1.4

### Patch Changes

- 555d0ff: fix identifier - all supported data types; correct SK for list

## 1.1.3

### Patch Changes

- ecc5540: Renaming SQL models should add refersTo directive

## 1.1.2

### Patch Changes

- 7f25eb0: Fixes auth permissions for custom types referenced by custom operations; other minor custom ops fixes

## 1.1.1

### Patch Changes

- 9bf67b7: Use pascal case of model name in graphql operation names

## 1.1.0

### Minor Changes

- 454ab50: feat!: rename relational modifiers for SQL schemas

## 1.0.1

### Patch Changes

- cdfeda5: fix: enforce non-empty a.schema definitions

## 1.0.0

### Major Changes

- 9daf354: first major version

### Patch Changes

- 4fb85b8: chore: add validation to schema process to disallow invalid ref use cases
- Updated dependencies [9daf354]
  - @aws-amplify/data-schema-types@1.0.0

## 0.18.4

### Patch Changes

- a4385c1: fixes return type data prop to always be nullable

## 0.18.3

### Patch Changes

- d473fbb: feat: making enum field or ref of enum field eligible to be PK or SK of 2nd-ary index

## 0.18.2

### Patch Changes

- b3fffcf: feat: rename iam -> identityPool
- Updated dependencies [b3fffcf]
  - @aws-amplify/data-schema-types@0.10.1

## 0.18.1

### Patch Changes

- e06891d: fix: hide .for() for a.query() and a.mutation()

## 0.18.0

### Minor Changes

- d49a92a: restructured ClientSchema properties for extensibility

## 0.17.1

### Patch Changes

- abfbd9d: fix: naming collision on default secondary index queryField

## 0.17.0

### Minor Changes

- e3fd1c7: bump minor in data-schema; missed in previous PR

## 0.16.2

### Patch Changes

- 4f2b22c: update custom operation types to respect optional fields

## 0.16.1

### Patch Changes

- 29d18a8: adds TS types and typesVersions for TS less than 5

## 0.16.0

### Minor Changes

- 2b0f03c: refactor: update authorization builder
- daeafeb: updates builds to include cjs, esm. moves runtime types and behavior into data-schema

### Patch Changes

- d7954e3: fix: timestamp fields are inserted for SQL schema
- Updated dependencies [daeafeb]
  - @aws-amplify/data-schema-types@0.9.0

## 0.15.0

### Minor Changes

- 922c344: feat!: support references based relationships. remove support for manyToMany

### Patch Changes

- Updated dependencies [922c344]
  - @aws-amplify/data-schema-types@0.8.0

## 0.14.14

### Patch Changes

- 4ef3d8d: latest tag is wrong from tag release testing; bumping patch to fix tag
- Updated dependencies [4ef3d8d]
  - @aws-amplify/data-schema-types@0.7.17

## 0.14.13

### Patch Changes

- f106212: fix: only the last function handler can be linked as data source

## 0.14.12

### Patch Changes

- 05915ab: enable model rename for SQL schemas

## 0.14.11

### Patch Changes

- 14a1951: fix: Change interface to move schema combination processing and expose rds config
- Updated dependencies [14a1951]
  - @aws-amplify/data-schema-types@0.7.16

## 0.14.10

### Patch Changes

- 9dfc6a9: feat: add .relationships() modifiers for RDSSchema

## 0.14.9

### Patch Changes

- 62a26bc: fix: Change interface to move schema combination processing and expose rds config
- Updated dependencies [62a26bc]
  - @aws-amplify/data-schema-types@0.7.15

## 0.14.8

### Patch Changes

- 08e47d1: fix: rds custom operations are missing from resolved types

## 0.14.7

### Patch Changes

- 96f3ee4: fix: field with field auth cannot be used as sort key of index

## 0.14.6

### Patch Changes

- 3127247: fix: remove .returns() modifier from custom subscription

## 0.14.5

### Patch Changes

- 0a935ad: feat: Raise an error on transform when combined schemes have conflicting type names

## 0.14.4

### Patch Changes

- 415914e: feat: Update the RDS config to match design feedback

## 0.14.3

### Patch Changes

- ec46bf2: remove implicit graphql fields from graphql schema and model intro schema

## 0.14.2

### Patch Changes

- c5fac1f: feat: ClientSchema conversion of a.combine schemas

## 0.14.1

### Patch Changes

- ffa6675: client types for custom subscriptions
- Updated dependencies [ffa6675]
  - @aws-amplify/data-schema-types@0.7.10

## 0.14.0

### Minor Changes

- 2d85439: refactor!: update .secondaryIndexes builder

## 0.13.18

### Patch Changes

- df1df38: add custom subscriptions

## 0.13.17

### Patch Changes

- 919e01e: feat: RDS ClientSchema without implicit fields / behavior

## 0.13.16

### Patch Changes

- 1804a21: feat: Remove implicit fields for static schema model transformations

## 0.13.15

### Patch Changes

- f33a8e6: remove underscores from generated fn names

## 0.13.14

### Patch Changes

- 0171ad5: handler.function supprts string | defineFunction
- Updated dependencies [0171ad5]
  - @aws-amplify/data-schema-types@0.7.8

## 0.13.13

### Patch Changes

- 0e36d74: fix: delete operation of m:m created implicit model not having correct param

## 0.13.12

### Patch Changes

- ab4bc27: feat: Schema transform logic for inlineSql and sqlReference handlers

## 0.13.11

### Patch Changes

- 14bc3f4: add schema-level lambda access auth rule
- Updated dependencies [14bc3f4]
  - @aws-amplify/data-schema-types@0.7.7

## 0.13.10

### Patch Changes

- bb1c1c6: feat: enable .array() modifier of RefType

## 0.13.9

### Patch Changes

- 1cb4344: feat: Add schema sql handler experience interface

## 0.13.8

### Patch Changes

- 2a56f91: feat: enable more field types and type resolution for CustomType

## 0.13.7

### Patch Changes

- 0cbbdf0: add JS resolver support for handler.custom
- Updated dependencies [0cbbdf0]
  - @aws-amplify/data-schema-types@0.7.6

## 0.13.6

### Patch Changes

- d1e13bc: Add meta types to support custom queries and mutations
- Updated dependencies [d1e13bc]
  - @aws-amplify/data-schema-types@0.7.5

## 0.13.5

### Patch Changes

- ac22ac8: feat: Add custom operation handler types
- Updated dependencies [ac22ac8]
  - @aws-amplify/data-schema-types@0.7.4

## 0.13.4

### Patch Changes

- 78e42c0: custom operations - prevent unrecoverable stack state
- be71ec3: feat: Add internals export to expose configure
- 6e927d1: fix: scope inline enum and custom type names with parent type name
  fix: disallow whitespace in enum values

## 0.13.3

### Patch Changes

- fbcc9dd: type perf improvements
- Updated dependencies [fbcc9dd]
  - @aws-amplify/data-schema-types@0.7.3

## 0.13.2

### Patch Changes

- d52beff: feat: Add addRelationships function to models

## 0.13.1

### Patch Changes

- f2aa9f6: feat: Add model references

## 0.13.0

### Minor Changes

- fdf446c: secondary index client types

### Patch Changes

- Updated dependencies [fdf446c]
  - @aws-amplify/data-schema-types@0.7.0

## 0.12.14

### Patch Changes

- 55e60b7: add secondary index support
- Updated dependencies [55e60b7]
  - @aws-amplify/data-schema-types@0.6.12

## 0.12.13

### Patch Changes

- d5c044a: fix nullable custom type field sel. set
- Updated dependencies [d5c044a]
  - @aws-amplify/data-schema-types@0.6.11

## 0.12.12

### Patch Changes

- 7348b09: depreacte arrayRequired modifier

## 0.12.11

### Patch Changes

- 6181dea: Hide custom ops from top-level client types
- Updated dependencies [6181dea]
  - @aws-amplify/data-schema-types@0.6.9

## 0.12.10

### Patch Changes

- 8370b63: inline custom return types on custom operations
- Updated dependencies [32ea316]
  - @aws-amplify/data-schema-types@0.6.8

## 0.12.9

### Patch Changes

- 8fc3d78: add error on graphql generation for models without authorization rules

## 0.12.8

### Patch Changes

- 83d27dc: fix: removed bad field conflict validation for identifiers

## 0.12.7

### Patch Changes

- 058b3ff: adds protection against conflicting field defs during graphql generation

## 0.12.6

### Patch Changes

- de4d219: fix: Add branding to all schema content types to get errors

## 0.12.5

### Patch Changes

- a74ff3a: removes over-aggressive conflict detection types for model authorization rules

## 0.12.4

### Patch Changes

- cfcf125: fix: Add branding to all field types to get schema errors'
- Updated dependencies [cfcf125]
  - @aws-amplify/data-schema-types@0.6.3

## 0.12.3

### Patch Changes

- a2f4869: docstring corrections for `a.allow` group(s) claim rules
- eb9b549: added missing withClaimIn builder methods on groupDefinedIn, groupsDefinedIn

## 0.12.2

### Patch Changes

- e16e1ca: custom op - add function by name
- Updated dependencies [131ffdd]
- Updated dependencies [504fb2b]
  - @aws-amplify/data-schema-types@0.6.2

## 0.12.1

### Patch Changes

- 87f3717: fix: Remove hasMany relational object mutation field

## 0.12.0

### Minor Changes

- 5df8a96: add custom operations (schema builder & transform)

## 0.11.1

### Patch Changes

- 38c3691: fix: JSON modeling schema issues

## 0.11.0

### Minor Changes

- bcdb110: use approved naming

### Patch Changes

- Updated dependencies [bcdb110]
  - @aws-amplify/data-schema-types@0.4.0

## 0.10.3

### Patch Changes

- c779b83: fix: Remove \_\_date from Authorization export

## 0.10.2

### Patch Changes

- e01c167: updates filter types to include all model fields
- Updated dependencies [e01c167]
  - @aws-amplify/amplify-api-next-types-alpha@0.3.1

## 0.10.1

### Patch Changes

- 6884086: made createdAt, updatedAt fields explicit in generated graphql
- a3e087f: makes owner, group fields explicit in generated graphql models
- 82ce901: made implicit PK field explicit in generated graphql

## 0.10.0

### Minor Changes

- 1f6bfcc: surface relationship FK fields explicitly in model types and generated graphql models

## 0.9.1

### Patch Changes

- 7d0d857: fix: Offer different required modifiers per relationship type

## 0.9.0

### Minor Changes

- df573ad: Added support for "a.allow.custom()" auth rule

## 0.8.0

### Minor Changes

- e7d75b0: custom types and enums support

## 0.7.4

### Patch Changes

- cba8bc9: fix: Mutation inputs should allow incomplete related objects

## 0.7.3

### Patch Changes

- fb0c94c: adds nextToken, limit to list op and related-model loaders
- Updated dependencies [fb0c94c]
  - @aws-amplify/amplify-api-next-types-alpha@0.2.8

## 0.7.2

### Patch Changes

- 2549750: fix relational input field in ModelMeta
- Updated dependencies [2549750]
  - @aws-amplify/amplify-api-next-types-alpha@0.2.7

## 0.7.1

### Patch Changes

- 2d6d480: added filter types for explicit scalar filter fields
- Updated dependencies [2d6d480]
  - @aws-amplify/amplify-api-next-types-alpha@0.2.6

## 0.7.0

### Minor Changes

- ada0afd: rename defineData; remove from public exports

## 0.6.2

### Patch Changes

- 0b72dac: adds docstring

## 0.6.1

### Patch Changes

- 193ffd1: adds authMode, authToken params to model methods and lazy loaders
- Updated dependencies [193ffd1]
  - @aws-amplify/amplify-api-next-types-alpha@0.2.4

## 0.6.0

### Minor Changes

- bf2b31b: update graphql return types to be `{data, nextToken, errors, extensions}`

### Patch Changes

- Updated dependencies [bf2b31b]
  - @aws-amplify/amplify-api-next-types-alpha@0.2.0

## 0.5.0

### Minor Changes

- 227fa88: custom selection set rework

### Patch Changes

- Updated dependencies [227fa88]
  - @aws-amplify/amplify-api-next-types-alpha@0.1.0

## 0.4.1

### Patch Changes

- 623991f: add type-level support for implicit fields
- Updated dependencies [623991f]
  - @aws-amplify/amplify-api-next-types-alpha@0.0.5

## 0.4.0

### Minor Changes

- fb3944a: make model fields optional by default

## 0.3.2

### Patch Changes

- fe1dd56: restructure types
- Updated dependencies [fe1dd56]
- Updated dependencies [fe1dd56]
  - @aws-amplify/amplify-api-next-types-alpha@0.0.3

## 0.3.1

### Patch Changes

- c2db4ec: migrate types to separate types-only package
- Updated dependencies [c2db4ec]
  - @aws-amplify/amplify-api-next-types-alpha@0.0.1

## 0.3.0

### Minor Changes

- 73bfecc: remove default export to fix ESM modules

## 0.2.0

### Minor Changes

- fe93dc2: export ModelSchema type and updated defineData util for Samsara

## 0.1.0

### Minor Changes

- 852f09e: defineData default export conforms to IAmplifyGraphqlDefinition

## 0.0.3

### Patch Changes

- 5146404: fix published package

## 0.0.2

### Patch Changes

- c4675a2: adds initial GHA workflows, changeset, tsc build
