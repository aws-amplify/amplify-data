---
'@aws-amplify/data-schema': patch
---

fix: prevent "Maximum call stack size exceeded" when custom types reference each other cyclically (e.g. `Tenant.company -> Company`, `Company.tenants -> [Tenant]`). Schema transform now visits each nested custom type once when propagating custom operation auth, and default client selection sets stop at a custom type that already appears in the current selection path.
