---
"@aws-amplify/data-schema": patch
---

fix: escape double quotes and backslashes in AI directive string arguments

`@conversation` and `@generation` directives interpolate user-supplied strings (`systemPrompt`, tool `description`) directly into GraphQL SDL without escaping special characters. Any prompt containing a double quote or backslash produces invalid SDL, breaking schema compilation. This fix escapes all GraphQL special characters before interpolation.
