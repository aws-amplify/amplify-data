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
      : T extends ModelRelationalField<infer RelationshipShape, any, any, any>
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
 * It drops belongsTo relational fields that match the source model
 *
 * For example, assuming the typical Post->Comment bi-directional hasMany relationship,
 * The generated structure will be
 * {
 *   id: string;
 *   title: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   comments: {
 *     id: string;
 *     createdAt: string;
 *     updatedAt: string;
 *     content: string;
 *     postId: string;
 *     ~~post~~ is dropped because data would be the same as top level object
 *   }[]
 * }
 *
 */
type ShortCircuitBiDirectionalRelationship<
  Model extends Record<string, any>,
  ParentModelName extends string,
  Raw extends ModelTypeParamShape['fields'],
> = {
  [Field in keyof Model as Field extends keyof Raw
    ? Raw[Field] extends ModelRelationalField<
        infer RelationshipShape,
        any,
        any,
        any
      >
      ? RelationshipShape['relationshipType'] extends 'belongsTo'
        ? RelationshipShape['relatedModel'] extends ParentModelName
          ? never
          : Field
        : Field
      : Field
    : Field]: Model[Field];
};

type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationalFieldParamShape,
  ParentModelName extends keyof Bag & string = never,
> =
  ExtendsNever<ParentModelName> extends true
    ? LazyLoader<
        RelationshipShape['valueRequired'] extends true
          ? Bag[RelationshipShape['relatedModel']]['type']
          : Bag[RelationshipShape['relatedModel']]['type'] | null,
        RelationshipShape['array']
      >
    : // Array-ing inline here vs. (inside of ShortCircuitBiDirectionalRelationship or in a separate conditional type) is significantly more performant
      RelationshipShape['array'] extends true
      ? Array<
          ShortCircuitBiDirectionalRelationship<
            Bag[RelationshipShape['relatedModel']]['__meta']['flatModel'],
            ParentModelName,
            Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields']
          >
        >
      : ShortCircuitBiDirectionalRelationship<
          Bag[RelationshipShape['relatedModel']]['__meta']['flatModel'],
          ParentModelName,
          Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields']
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
