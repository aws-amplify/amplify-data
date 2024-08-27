import { BaseModelField } from '../../ModelField';
import {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from '../../ModelRelationalField';
import { EnumType } from '../../EnumType';
import { CustomType } from '../../CustomType';
import { RefType, RefTypeParamShape } from '../../RefType';
import { ResolveRef } from './ResolveRef';
import { LazyLoader } from '../../runtime';

/**
 * Takes a `ReturnType<typeof a.model()>` and turns it into a client-consumable type. Fields
 * definitions (e.g., `a.string()`) are turned into the client facing types (e.g., `string`),
 * `a.ref()` fields will be resolved, and relationships (e.g., `a.belongsTo()`) will be
 * turned into `LazyLoader` fields (e.g., `post.comments({...})`).
 *
 * The first type parameter (`Bag`) should always just be the top-level `ClientSchema` that
 * references and related model definitions can be resolved against.
 */
export type ResolveFields<Bag extends Record<string, any>, T> = ShallowPretty<
  {
    [K in keyof T as IsRequired<T[K]> extends true
      ? K
      : never]: ResolveIndividualField<Bag, T[K]>;
  } & {
    [K in keyof T as IsRequired<T[K]> extends true
      ? never
      : K]+?: ResolveIndividualField<Bag, T[K]>;
  }
>;

// TODO: Remove ShallowPretty from this layer of resolution. Re-incorporate prettification
// down the line *as-needed*. Performing this *here* is somehow essential to getting 2 unit
// tests to pass, but hurts performance significantly. E.g., p50/operations/p50-prod-CRUDL.bench.ts
// goes from `783705` to `1046408`.
type ShallowPretty<T> = {
  [K in keyof T]: T[K];
};

export type ResolveIndividualField<Bag extends Record<string, any>, T> =
  T extends BaseModelField<infer FieldShape>
    ? FieldShape
    : T extends RefType<infer RefShape, any, any>
      ? ResolveRef<RefShape, Bag>
      : T extends ModelRelationalField<infer RelationshipShape, any, any, any>
        ? ResolveRelationship<Bag, RelationshipShape>
        : T extends CustomType<infer CT>
          ? ResolveFields<Bag, CT['fields']> | null
          : T extends EnumType<infer values>
            ? values[number] | null
            : never;

/**
 * Resolves to never if the related model has disabled list or get ops for hasOne/hasMany or belongsTo respectively
 */
type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationalFieldParamShape,
> = RelationshipShape['relationshipType'] extends 'hasOne' | 'hasMany'
  ? // relational getters depend on `list` being enabled on the related model
    'list' extends keyof Bag[RelationshipShape['relatedModel']]['__meta']['disabledOperations']
    ? never
    : LazyLoader<
        RelationshipShape['valueRequired'] extends true
          ? Bag[RelationshipShape['relatedModel']]['type']
          : Bag[RelationshipShape['relatedModel']]['type'] | null,
        RelationshipShape['array']
      >
  : // belongsTo
    'get' extends keyof Bag[RelationshipShape['relatedModel']]['__meta']['disabledOperations']
    ? never
    : LazyLoader<
        RelationshipShape['valueRequired'] extends true
          ? Bag[RelationshipShape['relatedModel']]['type']
          : Bag[RelationshipShape['relatedModel']]['type'] | null,
        RelationshipShape['array']
      >;

type IsRequired<T> =
  T extends BaseModelField<infer FieldShape>
    ? null extends FieldShape
      ? false
      : true
    : T extends RefType<infer RefShape, any, any>
      ? IsRefRequired<RefShape>
      : T extends ModelRelationalField<any, any, any, any>
        ? true
        : T extends CustomType<any> | EnumType<any>
          ? false
          : never;

type IsRefRequired<T extends RefTypeParamShape> = T['array'] extends true
  ? T['arrayRequired']
  : T['valueRequired'];
