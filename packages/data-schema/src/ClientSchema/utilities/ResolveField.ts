import { ModelField } from '../../ModelField';
import {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from '../../ModelRelationalField';
import { EnumType } from '../../EnumType';
import { CustomType } from '../../CustomType';
import { RefType } from '../../RefType';
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
export type ResolveFields<Bag extends Record<string, any>, T> = {
  [K in keyof T]: ResolveIndividualField<Bag, T[K]>;
};

export type ResolveIndividualField<Bag extends Record<string, any>, T> =
  T extends ModelField<infer FieldShape, any, any>
    ? FieldShape
    : T extends RefType<infer RefShape, any, any>
      ? ResolveRef<RefShape, Bag>
      : T extends ModelRelationalField<infer RelationshipShape, any, any, any>
        ? ResolveRelationship<Bag, RelationshipShape>
        : T extends CustomType<infer CT>
          ? ResolveFields<Bag, CT['fields']> | null
          : T extends EnumType<infer ET>
            ? ET['values'][number] | null
            : never;

type ResolveRelationship<
  Bag extends Record<string, any>,
  RelationshipShape extends ModelRelationalFieldParamShape,
> = LazyLoader<
  RelationshipShape['valueRequired'] extends true
    ? Bag[RelationshipShape['relatedModel']]['type']
    : Bag[RelationshipShape['relatedModel']]['type'] | null | undefined,
  RelationshipShape['array']
>;
