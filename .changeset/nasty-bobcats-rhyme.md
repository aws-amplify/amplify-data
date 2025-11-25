---
'@aws-amplify/data-schema-types': minor
'@aws-amplify/data-schema': minor
'integration-tests': patch
'benches': patch
---

New functionality added:

ShortCircuitBiDirectionalRelationship utility type
flatModel property in model **meta**
Depth-limited cycle detection
Updated SelectionSet type behavior
Significant improvements:

Fixes TS2590 errors (major bug fix)
30-60% performance improvement
Supports complex schemas that previously failed
