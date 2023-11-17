# @aws-amplify/amplify-api-next-alpha

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
