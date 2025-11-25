import { BaseModelField } from '../../ModelField';
import {
  ModelRelationshipField,
  ModelRelationshipFieldParamShape,
} from '../../ModelRelationshipField';
import { EnumType } from '../../EnumType';
import { CustomType } from '../../CustomType';
import { RefType, RefTypeParamShape } from '../../RefType';
import { ResolveRef } from './ResolveRef';
import { LazyLoader } from '../../runtime';
import type { ModelTypeParamShape } from '../../ModelType';

type ExtendsNever<T> = [T] extends [never] ? true : false;

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

export type FlatResolveFields<
  Bag extends Record<string, any>,
  T,
  FlatModelName extends keyof Bag & string = never,
> = ShallowPretty<{
  [K in keyof T]: ResolveIndividualField<Bag, T[K], FlatModelName>;
}>;

// TODO: Remove ShallowPretty from this layer of resolution. Re-incorporate prettification
// down the line *as-needed*. Performing this *here* is somehow essential to getting 2 unit
// tests to pass, but hurts performance significantly. E.g., p50/operations/p50-prod-CRUDL.bench.ts
// goes from `783705` to `1046408`.
type ShallowPretty<T> = {
  [K in keyof T]: T[K];
};

export type ResolveIndividualField<
  Bag extends Record<string, any>,
  T,
  FlatModelName extends keyof Bag & string = never,
> =
  T extends BaseModelField<infer FieldShape>
    ? FieldShape
    : T extends RefType<infer RefShape, any, any>
      ? ResolveRef<RefShape, Bag>
      : T extends ModelRelationshipField<infer RelationshipShape, any, any, any>
        ? ResolveRelationship<Bag, RelationshipShape, FlatModelName>
        : T extends CustomType<infer CT>
          ? ResolveFields<Bag, CT['fields']> | null
          : T extends EnumType<infer values>
            ? values[number] | null
            : never;

/**
 * This mapped type eliminates redundant recursive types when
 * generating the ['__meta']['flatModel'] type that serves as the
 * basis for custom selection set path type generation
 *
 * DEPTH-LIMITED APPROACH:
 * - At depth 0 (first level): Keep ALL belongsTo fields (allows single-level joins)
 * - At depth 1+: Remove belongsTo fields that cycle back to parent (prevents deep cycles)
 *
 * This allows valid patterns like:
 * - Comment → post.title (depth 0 → 1: allowed)
 * - Order → customer.name (depth 0 → 1: allowed)
 *
 * While blocking actual cycles like:
 * - Post → comments → post (depth 1 → 2: blocked)
 * - Comment → post → comments (depth 1 → 2: blocked)
 *
 * For example, assuming the typical Post->Comment bi-directional hasMany relationship:
 *
 * When querying from Comment (depth 0):
 * {
 *   id: string;
 *   content: string;
 *   postId: string;
 *   post: {  // ✅ Kept at depth 0 (allows Comment → Post join)
 *     id: string;
 *     title: string;
 *     comments: {  // At depth 1, belongsTo back to Comment would be removed
 *       id: string;
 *       content: string;
 *       // post is removed here (would cycle back)
 *     }[]
 *   }
 * }
 *
 * When querying from Post (depth 0):
 * {
 *   id: string;
 *   title: string;
 *   comments: {
 *     id: string;
 *     content: string;
 *     postId: string;
 *     // post is removed here (would cycle back to Post at depth 1)
 *   }[]
 * }
 */
type ShortCircuitBiDirectionalRelationship<
  Model extends Record<string, any>,
  ParentModelName extends string,
  Raw extends ModelTypeParamShape['fields'],
  Depth extends number = 0, // Track depth: 0 = first level, 1+ = nested
> = {
  [Field in keyof Model as Field extends keyof Raw
    ? Raw[Field] extends ModelRelationshipField<
        infer RelationshipShape,
        any,
        any,
        any
      >
      ? RelationshipShape['relationshipType'] extends 'belongsTo'
        ? Depth extends 0
          ? Field // ✅ At depth 0: Keep belongsTo (allows single-level joins)
          : RelationshipShape['relatedModel'] extends ParentModelName
            ? never // ❌ At depth 1+: Remove belongsTo back to parent (prevents cycles)
            : Field
        : Field
      : Field
    : Field]: Model[Field];
};

type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationshipFieldParamShape,
  ParentModelName extends keyof Bag & string = never,
> =
  ExtendsNever<ParentModelName> extends true
    ? DependentLazyLoaderOpIsAvailable<Bag, RelationshipShape> extends true
      ? LazyLoader<
          RelationshipShape['valueRequired'] extends true
            ? Bag[RelationshipShape['relatedModel']]['type']
            : Bag[RelationshipShape['relatedModel']]['type'] | null,
          RelationshipShape['array']
        >
      : never
    : // Array-ing inline here vs. (inside of ShortCircuitBiDirectionalRelationship or in a separate conditional type) is significantly more performant
      // Pass depth 1 to indicate we're now at nested level (belongsTo back to parent will be blocked)
      RelationshipShape['array'] extends true
      ? Array<
          ShortCircuitBiDirectionalRelationship<
            Bag[RelationshipShape['relatedModel']]['__meta']['flatModel'],
            ParentModelName,
            Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields'],
            1 // Nested level: blocks belongsTo back to parent
          >
        >
      : ShortCircuitBiDirectionalRelationship<
          Bag[RelationshipShape['relatedModel']]['__meta']['flatModel'],
          ParentModelName,
          Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields'],
          1 // Nested level: blocks belongsTo back to parent
        >;

type DependentLazyLoaderOpIsAvailable<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationshipFieldParamShape,
> = RelationshipShape['relationshipType'] extends 'hasOne' | 'hasMany'
  ? // hasOne and hasMany depend on `list`
    'list' extends keyof Bag[RelationshipShape['relatedModel']]['__meta']['disabledOperations']
    ? false
    : true
  : // the relationship is a belongsTo, which depends on `get`
    'get' extends keyof Bag[RelationshipShape['relatedModel']]['__meta']['disabledOperations']
    ? false
    : true;

type IsRequired<T> =
  T extends BaseModelField<infer FieldShape>
    ? null extends FieldShape
      ? false
      : true
    : T extends RefType<infer RefShape, any, any>
      ? IsRefRequired<RefShape>
      : T extends ModelRelationshipField<any, any, any, any>
        ? true
        : T extends CustomType<any> | EnumType<any>
          ? false
          : never;

type IsRefRequired<T extends RefTypeParamShape> = T['array'] extends true
  ? T['arrayRequired']
  : T['valueRequired'];
