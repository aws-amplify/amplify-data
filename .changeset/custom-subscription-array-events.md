---
'@aws-amplify/data-schema': patch
---

Custom subscriptions whose source mutation returns a model array now emit an array of model instances. Previously the whole array was treated as a single record, which produced an unusable object.
