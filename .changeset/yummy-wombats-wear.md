---
'@aws-amplify/data-schema-types': minor
'@aws-amplify/data-schema': minor
'integration-tests': patch
---

- add optional sourceRegion and crossRegionInference parameters to model() and update AiModel type correspondingly
- add sourceRegion and crossRegionInference parameters to generation and conversation directives
- add tests for generation and conversation directives with sourceRegion and crossRegionInference params
- add integration tests for conversation route with sourceRegion and crossRegionInference params
