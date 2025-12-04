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
import type { ExtendsNever } from '../../util';

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

/**
 * Resolves model fields with parent model name tracking for cycle detection.
 * Used to generate FlatModel types that short-circuit bi-directional relationships.
 *
 * @param Bag - The top-level ClientSchema for resolving references
 * @param T - The fields to resolve
 * @param FlatModelName - The name of the parent model for cycle detection
 * @param Raw - The raw field metadata for detecting relationship types
 */
export type FlatResolveFields<
  Bag extends Record<string, any>,
  T,
  FlatModelName extends keyof Bag & string = never,
  Raw extends Record<string, any> = Record<string, never>,
> = ShallowPretty<
  ShortCircuitBiDirectionalRelationship<
    {
      [K in keyof T as IsRequired<T[K]> extends true
        ? K
        : never]: ResolveIndividualField<Bag, T[K], FlatModelName>;
    } & {
      [K in keyof T as IsRequired<T[K]> extends true
        ? never
        : K]+?: ResolveIndividualField<Bag, T[K], FlatModelName>;
    },
    FlatModelName,
    Raw
  >
>;

/**
 * Filters out `belongsTo` relationship fields that reference the parent model.
 * This prevents cyclical path generation in selection sets.
 *
 * @param Model - The resolved model fields
 * @param ParentModelName - The name of the parent model to detect cycles
 * @param Raw - The raw field metadata containing relationship information
 */
export type ShortCircuitBiDirectionalRelationship<
  Model extends Record<string, any>,
  ParentModelName extends string,
  Raw extends Record<string, any>,
> =
  ExtendsNever<ParentModelName> extends true
    ? Model
    : {
        [Field in keyof Model as Field extends keyof Raw
          ? Raw[Field] extends ModelRelationshipField<
              infer RelationshipShape extends ModelRelationshipFieldParamShape,
              any,
              any,
              any
            >
            ? RelationshipShape['relationshipType'] extends 'belongsTo'
              ? RelationshipShape['relatedModel'] extends ParentModelName
                ? never // Short-circuit: omit this field
                : Field
              : Field
            : Field
          : Field]: Model[Field];
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
 * Resolves relationship fields to either LazyLoader (standard resolution) or
 * inline types with cycle detection (flat model resolution).
 *
 * When ParentModelName is provided (flat model resolution):
 * - Uses ShortCircuitBiDirectionalRelationship to omit cyclical belongsTo fields
 * - Resolves relationships inline instead of using LazyLoader
 *
 * When ParentModelName is never (standard resolution):
 * - Uses LazyLoader for relationship fields
 * - Resolves to never if the related model has disabled list/get ops
 */
type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationshipFieldParamShape,
  ParentModelName extends keyof Bag & string = never,
> =
  ExtendsNever<ParentModelName> extends true
    ? // Standard resolution with LazyLoader
      DependentLazyLoaderOpIsAvailable<Bag, RelationshipShape> extends true
      ? LazyLoader<
          RelationshipShape['valueRequired'] extends true
            ? Bag[RelationshipShape['relatedModel']]['type']
            : Bag[RelationshipShape['relatedModel']]['type'] | null,
          RelationshipShape['array']
        >
      : never
    : // Flat model resolution with cycle detection
      RelationshipShape['array'] extends true
      ? Array<
          FlatResolveRelatedModel<
            Bag,
            RelationshipShape['relatedModel'],
            ParentModelName
          >
        >
      : RelationshipShape['valueRequired'] extends true
        ? FlatResolveRelatedModel<
            Bag,
            RelationshipShape['relatedModel'],
            ParentModelName
          >
        : FlatResolveRelatedModel<
            Bag,
            RelationshipShape['relatedModel'],
            ParentModelName
          > | null;

/**
 * Resolves a related model for flat model generation.
 * Re-resolves the related model's fields with the parent model name for proper
 * cycle detection. This ensures that when traversing Author -> Post, the Post's
 * `author` belongsTo field is correctly short-circuited.
 *
 * Note: We cannot use the pre-computed flatModel from __meta because it was
 * computed with the related model as the parent, not the current traversal parent.
 */
type FlatResolveRelatedModel<
  Bag extends Record<string, any>,
  RelatedModelName extends string,
  ParentModelName extends string,
> = RelatedModelName extends keyof Bag
  ? Bag[RelatedModelName] extends { __meta: { rawType: infer RT } }
    ? RT extends { fields: infer F }
      ? FlatResolveFields<Bag, F, ParentModelName, F & Record<string, any>>
      : Bag[RelatedModelName]['type']
    : Bag[RelatedModelName]['type']
  : never;

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
