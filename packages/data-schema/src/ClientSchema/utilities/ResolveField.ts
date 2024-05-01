import { ModelField } from '../../ModelField';
import {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from '../../ModelRelationalField';
import { RefType } from '../../RefType';
import { ResolveRef } from './ResolveRef';
import { LazyLoader } from '../../runtime';

export type ResolveFields<Bag extends Record<string, any>, T> = {
  [K in keyof T]: ResolveIndividualField<Bag, T[K]>;
};

export type ResolveIndividualField<Bag extends Record<string, any>, T> =
  T extends ModelField<infer FieldShape, any, any>
    ? FieldShape
    : T extends RefType<infer RefShape>
      ? ResolveRef<RefShape, Bag>
      : T extends ModelRelationalField<infer RelationshipShape, any, any, any>
        ? ResolveRelationship<Bag, RelationshipShape>
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
