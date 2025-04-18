<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema](./data-schema.md) &gt; [RDSModelSchema](./data-schema.rdsmodelschema.md)

## RDSModelSchema type

RDSModel schema definition interface

**Signature:**

```typescript
export type RDSModelSchema<T extends RDSModelSchemaParamShape, UsedMethods extends RDSModelSchemaFunctions = never> = Omit<{
    addToSchema: <AddedTypes extends AddToSchemaContents>(types: AddedTypes) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & AddedTypes>, UsedMethods | 'addToSchema'>;
    addQueries: <Queries extends Record<string, QueryCustomOperation>>(types: Queries) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Queries>, UsedMethods | 'addQueries'>;
    addMutations: <Mutations extends Record<string, MutationCustomOperation>>(types: Mutations) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Mutations>, UsedMethods | 'addMutations'>;
    addSubscriptions: <Subscriptions extends Record<string, SubscriptionCustomOperation>>(types: Subscriptions) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Subscriptions>, UsedMethods | 'addSubscriptions'>;
    authorization: <AuthRules extends SchemaAuthorization<any, any, any>>(callback: (allow: AllowModifier) => AuthRules | AuthRules[]) => RDSModelSchema<SetTypeSubArg<T, 'authorization', AuthRules[]>, UsedMethods | 'authorization'>;
    setAuthorization: (callback: (models: OmitFromEach<BaseSchema<T, true>['models'], 'secondaryIndexes'>, schema: RDSModelSchema<T, UsedMethods | 'setAuthorization'>) => void) => RDSModelSchema<T>;
    setRelationships: <Relationships extends ReadonlyArray<Partial<Record<keyof T['types'], RelationshipTemplate>>>>(callback: (models: OmitFromEach<BaseSchema<T, true>['models'], 'authorization' | 'fields' | 'secondaryIndexes'>) => Relationships) => RDSModelSchema<SetTypeSubArg<T, 'types', {
        [ModelName in keyof T['types']]: ModelWithRelationships<T['types'], Relationships, ModelName>;
    }>, UsedMethods | 'setRelationships'>;
    renameModels: <NewName extends string, CurName extends string = keyof BaseSchema<T>['models'] & string, const ChangeLog extends readonly [CurName, NewName][] = []>(callback: () => ChangeLog) => RDSModelSchema<SetTypeSubArg<T, 'types', RenameUsingTuples<T['types'], ChangeLog>>, UsedMethods | 'renameModels'>;
}, UsedMethods> & BaseSchema<T, true> & RDSSchemaBrand;
```
**References:** [RDSModelSchema](./data-schema.rdsmodelschema.md)

