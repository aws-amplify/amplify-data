<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema](./data-schema.md) &gt; [ClientSchema](./data-schema.clientschema.md)

## ClientSchema type

**Signature:**

```typescript
export type ClientSchema<Schema extends GenericModelSchema<any> | CombinedModelSchema<any>> = Schema extends GenericModelSchema<any> ? InternalClientSchema<Schema> : Schema extends CombinedModelSchema<any> ? InternalCombinedSchema<Schema> : never;
```
**References:** [CombinedModelSchema](./data-schema.combinedmodelschema.md)

