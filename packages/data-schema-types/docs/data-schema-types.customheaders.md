<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema-types](./data-schema-types.md) &gt; [CustomHeaders](./data-schema-types.customheaders.md)

## CustomHeaders type

Custom headers that can be passed either to the client or to individual model operations, either as a static object or a function that returns a promise.

**Signature:**

```typescript
export type CustomHeaders = Record<string, string> | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);
```
**References:** [RequestOptions](./data-schema-types.requestoptions.md)

