<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@aws-amplify/data-schema-types](./data-schema-types.md) &gt; [ExcludeEmpty](./data-schema-types.excludeempty.md)

## ExcludeEmpty type

**Signature:**

```typescript
export type ExcludeEmpty<U> = U extends U ? object extends U ? never : U : never;
```

## Example

ExcludeEmpty<!-- -->&lt;<!-- -->{<!-- -->a: 1<!-- -->} \| {<!-- -->} \| {<!-- -->b: 2<!-- -->}<!-- -->&gt; =<!-- -->&gt; {<!-- -->a: 1<!-- -->} \| {<!-- -->b: 2<!-- -->}

