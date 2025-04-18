<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema](./data-schema.md) &gt; [a](./data-schema.a.md) &gt; [belongsTo](./data-schema.a.belongsto.md)

## a.belongsTo() function

Use `belongsTo()` to create a field to query the related `hasOne()` or `hasMany()` relationship. The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from parent to the related model.

**Signature:**

```typescript
export declare function belongsTo<RM extends string>(relatedModel: RM, references: string | string[]): ModelRelationshipField<ModelRelationshipTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false>, RM, "required" | "valueRequired", undefined>;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

relatedModel


</td><td>

RM


</td><td>

name of the related `.hasOne()` or `.hasMany()` model


</td></tr>
<tr><td>

references


</td><td>

string \| string\[\]


</td><td>

the field(s) that should be used to reference the related model


</td></tr>
</tbody></table>
**Returns:**

[ModelRelationshipField](./data-schema.modelrelationshipfield.md)<!-- -->&lt;[ModelRelationshipTypeArgFactory](./data-schema.modelrelationshiptypeargfactory.md)<!-- -->&lt;RM, [ModelRelationshipTypes.belongsTo](./data-schema.modelrelationshiptypes.md)<!-- -->, false&gt;, RM, "required" \| "valueRequired", undefined&gt;

a belong-to relationship definition

## Example 1

// one-to-many relationship const schema = a.schema(<!-- -->{ Member: a.model(<!-- -->{ name: a.string().required(), // 1. Create a reference field teamId: a.id(), // 2. Create a belongsTo relationship with the reference field team: a.belongsTo('Team', 'teamId'), }<!-- -->) .authorization(allow =<!-- -->&gt; \[allow.publicApiKey()\]),

Team: a.model(<!-- -->{ mantra: a.string().required(), // 3. Create a hasMany relationship with the reference field // from the `Member`<!-- -->s model. members: a.hasMany('Member', 'teamId'), }<!-- -->) .authorization(allow =<!-- -->&gt; \[allow.publicApiKey()\]), }<!-- -->);

## Example 2

// one-to-one relationship const schema = a.schema(<!-- -->{ Cart: a.model(<!-- -->{ items: a.string().required().array(), // 1. Create reference field customerId: a.id(), // 2. Create relationship field with the reference field customer: a.belongsTo('Customer', 'customerId'), }<!-- -->), Customer: a.model(<!-- -->{ name: a.string(), // 3. Create relationship field with the reference field // from the Cart model activeCart: a.hasOne('Cart', 'customerId') }<!-- -->), }<!-- -->);

