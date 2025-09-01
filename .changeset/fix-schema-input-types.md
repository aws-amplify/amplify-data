---
"@aws-amplify/data-schema": patch
---

fix(schema): preserve `array`, `arrayRequired`, and `valueRequired` when generating input types for custom fields

Previously, nested custom input types dropped important metadata about array and requiredness.  
This change ensures:

- `array` is passed through for referenced custom types
- `arrayRequired` and `valueRequired` are correctly preserved
- Inline custom types default to `false` for these fields

This fixes inconsistencies between schema definitions and generated GraphQL input types.
