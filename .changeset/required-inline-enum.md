---
'@aws-amplify/data-schema': minor
---

feat: support `.required()` on inline enum fields, e.g. `status: a.enum(['draft', 'published']).required()`, which emits a non-nullable enum field (`status: PostStatus!`) and makes the field required in client model and create input types
