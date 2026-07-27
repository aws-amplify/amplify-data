---
'@aws-amplify/data-schema': patch
---

Fix the client-side `requires arguments` error thrown for nullable list arguments on custom operations ([#767](https://github.com/aws-amplify/amplify-data/issues/767)).

An argument declared as `a.ref('Color').required().array()` is emitted as `[Color!]` — a nullable list of non-null elements — so omitting it is valid, but the client rejected the call before sending a request. The model introspection schema encodes _element_ nullability in `isRequired` and _list_ nullability in `isArrayNullable`, and the pre-flight check in `operationVariables()` read `isRequired` alone. It now derives argument nullability the same way `outerArguments()` derives the rendered variable type, so the two can no longer disagree.

Conversely, omitting a non-null list argument (`a.string().array().required()`, i.e. `[String]!`) now fails that pre-flight check instead of sending a request that declares a non-null variable with no value. Such a request was already rejected by AppSync, and the argument is required at the type level, so only untyped callers are affected. For them the failure surfaces differently: a query or mutation now rejects instead of resolving to `{ data: null, errors }`, and a subscription now throws synchronously instead of returning an observable that errors. That matches the pre-existing behavior for a non-null scalar argument.
