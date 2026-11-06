---
'@aws-amplify/data-schema': patch
---

Export the `ModelTypesClient` type from `@aws-amplify/data-schema/runtime` so a
single model client (e.g. `client.models.Todo`) can be referenced by type, e.g.
`ModelTypesClient<Schema['Todo']>`.
