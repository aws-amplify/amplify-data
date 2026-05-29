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
import type { DefaultSelectionSetDepth } from '../../ModelSchema';
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
  Depth extends number = DefaultSelectionSetDepth,
> = ShallowPretty<{
  [K in keyof T]: ResolveIndividualField<Bag, T[K], FlatModelName, Depth>;
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
  Depth extends number = DefaultSelectionSetDepth,
> =
  T extends BaseModelField<infer FieldShape>
    ? FieldShape
    : T extends RefType<infer RefShape, any, any>
      ? ResolveRef<RefShape, Bag>
      : T extends ModelRelationshipField<infer RelationshipShape, any, any, any>
        ? ResolveRelationship<Bag, RelationshipShape, FlatModelName, Depth>
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
    ? Raw[Field] extends ModelRelationshipField<
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

/** Subtract 1 from a depth counter, bounded at 0. Outside 0–5 falls through to 0. */
type Decrement<N extends number> =
  N extends 5 ? 4
  : N extends 4 ? 3
  : N extends 3 ? 2
  : N extends 2 ? 1
  : N extends 1 ? 0
  : 0;

/**
 * Replaces each relationship field on the inlined related-model `type` with the
 * related model's `type` recursively flattened, decrementing `Depth` per hop.
 * At `Depth=0`, strips relationships entirely so ModelPathInner can't recurse
 * into a LazyLoader leaf and the cascade terminates.
 */
type FlattenRelationships<
  Bag extends Record<string, any>,
  Model extends Record<string, any>,
  RawFields extends Record<string, any>,
  Depth extends number = DefaultSelectionSetDepth,
> = Depth extends 0
  ? OmitRelationships<Model, RawFields>
  : {
      [K in keyof Model]: K extends keyof RawFields
        ? RawFields[K] extends ModelRelationshipField<infer RS, any, any, any>
          ? RS['array'] extends true
            ? Array<
                FlattenRelationships<
                  Bag,
                  Bag[RS['relatedModel']]['type'],
                  Bag[RS['relatedModel']]['__meta']['rawType']['fields'],
                  Decrement<Depth>
                >
              >
            : FlattenRelationships<
                Bag,
                Bag[RS['relatedModel']]['type'],
                Bag[RS['relatedModel']]['__meta']['rawType']['fields'],
                Decrement<Depth>
              >
          : Model[K]
        : Model[K];
    };

/** Terminal case at the depth boundary: drop relationships entirely. */
type OmitRelationships<
  Model extends Record<string, any>,
  RawFields extends Record<string, any>,
> = {
  [K in keyof Model as K extends keyof RawFields
    ? RawFields[K] extends ModelRelationshipField<any, any, any, any>
      ? never
      : K
    : K]: Model[K];
};

/** Shared `LazyLoader` shape used by the non-flat branch and the depth=0 short-circuit. */
type LazyLoaderForRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationshipFieldParamShape,
> = DependentLazyLoaderOpIsAvailable<Bag, RelationshipShape> extends true
  ? LazyLoader<
      RelationshipShape['valueRequired'] extends true
        ? Bag[RelationshipShape['relatedModel']]['type']
        : Bag[RelationshipShape['relatedModel']]['type'] | null,
      RelationshipShape['array']
    >
  : never;

type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationshipFieldParamShape,
  ParentModelName extends keyof Bag & string = never,
  Depth extends number = DefaultSelectionSetDepth,
> =
  ExtendsNever<ParentModelName> extends true
    ? LazyLoaderForRelationship<Bag, RelationshipShape>
    : Depth extends 0
      ? LazyLoaderForRelationship<Bag, RelationshipShape>
      : // Array-ing inline here vs. (inside of ShortCircuitBiDirectionalRelationship or in a separate conditional type) is significantly more performant
        RelationshipShape['array'] extends true
        ? Array<
            ShortCircuitBiDirectionalRelationship<
              FlattenRelationships<
                Bag,
                Bag[RelationshipShape['relatedModel']]['type'],
                Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields'],
                Decrement<Depth>
              >,
              ParentModelName,
              Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields']
            >
          >
        : ShortCircuitBiDirectionalRelationship<
            FlattenRelationships<
              Bag,
              Bag[RelationshipShape['relatedModel']]['type'],
              Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields'],
              Decrement<Depth>
            >,
            ParentModelName,
            Bag[RelationshipShape['relatedModel']]['__meta']['rawType']['fields']
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
