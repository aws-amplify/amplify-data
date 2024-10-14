<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema](./data-schema.md) &gt; [ModelField](./data-schema.modelfield.md)

## ModelField type

Public API for the chainable builder methods exposed by Model Field. The type is narrowing e.g., after calling .array() it will be omitted from intellisense suggestions

**Signature:**

```typescript
export type ModelField<T extends ModelFieldTypeParamOuter = ModelFieldTypeParamOuter, UsedMethod extends UsableModelFieldKey = never, Auth = undefined> = Omit<{
    [__auth]?: Auth;
    [brandSymbol]: typeof brandName;
    required(): ModelField<Required<T>, UsedMethod | 'required'>;
    array(): ModelField<ArrayField<T>, Exclude<UsedMethod, 'required'>>;
    default(value?: ModelFieldTypeParamOuter): ModelField<T, UsedMethod | 'default'>;
    authorization<AuthRuleType extends Authorization<any, any, any>>(callback: (allow: Omit<AllowModifier, 'resource'>) => AuthRuleType | AuthRuleType[]): ModelField<T, UsedMethod | 'authorization', AuthRuleType>;
}, UsedMethod>;
```
**References:** [ModelField](./data-schema.modelfield.md)<!-- -->, [Authorization](./data-schema.authorization.md)
