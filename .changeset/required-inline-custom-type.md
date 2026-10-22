---
"@aws-amplify/data-schema": minor
---

Support `.required()` on inline custom types (`a.customType({...}).required()`) used as model fields, nested custom type fields, and custom operation arguments / return types. The generated GraphQL type becomes non-nullable (e.g. `keys: NotificationSubscriptionKeys!`) and the client types treat the field as required, matching `a.ref('MyType').required()`. Calling `.required()` on a top-level custom type definition throws at schema transform time; use `a.ref('MyType').required()` at the reference site instead.
