<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema](./data-schema.md) &gt; [CombinedModelSchema](./data-schema.combinedmodelschema.md)

## CombinedModelSchema type

CombinedModel schema definition interface

**Signature:**

```typescript
export type CombinedModelSchema<Schemas extends GenericModelSchema<any>[]> = CombinedSchemaBrand & {
    schemas: [...Schemas];
};
```
