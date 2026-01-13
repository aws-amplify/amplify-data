# @aws-amplify/data-schema-types

## 1.2.1

### Patch Changes

- c79737f: chore: documentation updates

## 1.2.0

### Minor Changes

- 8497f22: Move AiModel to data-schema-types

## 1.1.1

### Patch Changes

- 4d2ad3f: remove declarationMap config from tsconfig

## 1.1.0

### Minor Changes

- ba7802e: Support custom SSL certificates in SQL data sources

## 1.0.1

### Patch Changes

- 4c7eb71: perf optimizations, minor builder refactor

## 1.0.0

### Major Changes

- 9daf354: first major version

## 0.10.1

### Patch Changes

- b3fffcf: feat: rename iam -> identityPool

## 0.10.0

### Minor Changes

- f159fcd: update return types to be nullable on error

## 0.9.0

### Minor Changes

- daeafeb: updates builds to include cjs, esm. moves runtime types and behavior into data-schema

## 0.8.0

### Minor Changes

- 922c344: feat!: support references based relationships. remove support for manyToMany

## 0.7.17

### Patch Changes

- 4ef3d8d: latest tag is wrong from tag release testing; bumping patch to fix tag

## 0.7.16

### Patch Changes

- 14a1951: fix: Change interface to move schema combination processing and expose rds config

## 0.7.15

### Patch Changes

- 62a26bc: fix: Change interface to move schema combination processing and expose rds config

## 0.7.14

### Patch Changes

- a0d123f: add duplicate 'ModelSortDirection' type export to index.v3.ts

## 0.7.13

### Patch Changes

- afc2963: add gsi sort for list and index query

## 0.7.12

### Patch Changes

- 2661c53: types - explicit dep on plugin-types

## 0.7.11

### Patch Changes

- 8498a3b: add builder.v3 types without plugin-types dep

## 0.7.10

### Patch Changes

- ffa6675: client types for custom subscriptions

## 0.7.9

### Patch Changes

- b4cd82a: Adds function handler types to help author lambda handlers for custom operations

## 0.7.8

### Patch Changes

- 0171ad5: handler.function supprts string | defineFunction

## 0.7.7

### Patch Changes

- 14bc3f4: add schema-level lambda access auth rule

## 0.7.6

### Patch Changes

- 0cbbdf0: add JS resolver support for handler.custom

## 0.7.5

### Patch Changes

- d1e13bc: Add meta types to support custom queries and mutations

## 0.7.4

### Patch Changes

- ac22ac8: feat: Add custom operation handler types

## 0.7.3

### Patch Changes

- fbcc9dd: type perf improvements

## 0.7.2

### Patch Changes

- f8ada2c: fix: add EnumTypes for ts < 5

## 0.7.1

### Patch Changes

- e1f9f59: feat: add EnumTypes utility type supporting client.enums property

## 0.7.0

### Minor Changes

- fdf446c: secondary index client types

## 0.6.12

### Patch Changes

- 55e60b7: add secondary index support

## 0.6.11

### Patch Changes

- d5c044a: fix nullable custom type field sel. set

## 0.6.10

### Patch Changes

- 5143bd1: minor update to RequestOptions type

## 0.6.9

### Patch Changes

- 6181dea: Add HasKey util type

## 0.6.8

### Patch Changes

- 32ea316: Add type for request options

## 0.6.7

### Patch Changes

- e482574: add missing props to subscription fn sig

## 0.6.6

### Patch Changes

- 258121b: fix schema file tsc compliance

## 0.6.5

### Patch Changes

- b675dbb: fix: Create operation identifier type refinement

## 0.6.4

### Patch Changes

- a496770: fix: lazy loaded hasMany should not be nullable

## 0.6.3

### Patch Changes

- cfcf125: fix: Add branding to all field types to get schema errors'

## 0.6.2

### Patch Changes

- 131ffdd: update custom header type
- 504fb2b: update custom header comments

## 0.6.1

### Patch Changes

- 9e1fbc2: extend GraphQLFormattedError - include errorType & errorInfo

## 0.6.0

### Minor Changes

- 9ab2240: add custom header types for subscription

## 0.5.0

### Minor Changes

- ff67e28: add types for custom headers

## 0.4.2

### Patch Changes

- 943fb32: include TS src for RN

## 0.4.1

### Patch Changes

- 96f61c6: fix v3 type

## 0.4.0

### Minor Changes

- bcdb110: use approved naming

## 0.3.1

### Patch Changes

- e01c167: updates filter types to include all model fields

## 0.3.0

### Minor Changes

- 1740872: update DerivedModelSchema type

## 0.2.8

### Patch Changes

- fb0c94c: adds nextToken, limit to list op and related-model loaders

## 0.2.7

### Patch Changes

- 2549750: fix relational input field in ModelMeta

## 0.2.6

### Patch Changes

- 2d6d480: added filter types for explicit scalar filter fields

## 0.2.5

### Patch Changes

- 17769e6: add SSR ModelTypes

## 0.2.4

### Patch Changes

- 193ffd1: adds authMode, authToken params to model methods and lazy loaders

## 0.2.3

### Patch Changes

- 2bde78c: added observeQuery to model method definitions

## 0.2.2

### Patch Changes

- cf5fddd: allow array literals in selectionSet option parm

## 0.2.1

### Patch Changes

- e85cca9: added onCreate, onUpdate, onDelete model method definitions

## 0.2.0

### Minor Changes

- bf2b31b: update graphql return types to be `{data, nextToken, errors, extensions}`

## 0.1.2

### Patch Changes

- 68bf9b8: backwards compatibility type fix

## 0.1.1

### Patch Changes

- 5f2c289: add missing file

## 0.1.0

### Minor Changes

- 227fa88: custom selection set rework

## 0.0.5

### Patch Changes

- 623991f: add type-level support for implicit fields

## 0.0.4

### Patch Changes

- 1ef5c01: fix typesVersion in types package for backwards-compat with DS

## 0.0.3

### Patch Changes

- fe1dd56: change package types to output d.ts instead of ts files
- fe1dd56: restructure types

## 0.0.2

### Patch Changes

- 0a02556: fix packaged files

## 0.0.1

### Patch Changes

- c2db4ec: migrate types to separate types-only package
