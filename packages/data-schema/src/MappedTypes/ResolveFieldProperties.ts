import type {
  UnionToIntersection,
  LazyLoader,
} from '@aws-amplify/data-schema-types';
import type { Authorization, ImpliedAuthFields } from '../Authorization';
import type { ModelField } from '../ModelField';
import type { ModelType, ModelTypeParamShape } from '../ModelType';
import type { GenericModelSchema } from '../ModelSchema';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from '../ModelRelationalField';

import type { ResolveSchema, SchemaTypes } from './ResolveSchema';
import type { InjectImplicitModelFields } from './ImplicitFieldInjector';
import type { ModelIdentifier } from './ModelMetadata';
import type { RefType, RefTypeParamShape } from '../RefType';

import type { NonModelTypesShape } from './ExtractNonModelTypes';

import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';

export type ResolveFieldProperties<
  Schema extends GenericModelSchema<any>,
  NonModelTypes extends NonModelTypesShape,
  ResolvedSchema = ResolveSchema<Schema>,
  IdentifierMeta extends Record<
    string,
    { identifier: string }
  > = ModelIdentifier<SchemaTypes<Schema>>,
  FieldsWithInjectedImplicitFields = InjectImplicitModelFields<
    ResolvedSchema,
    IdentifierMeta
  >,
  FieldsWithRelationships = ResolveModelsRelationalAndRefFields<
    FieldsWithInjectedImplicitFields,
    NonModelTypes
  >,
> = Intersection<
  FilterFieldTypes<
    MarkModelsNonNullableFieldsRequired<FieldsWithRelationships>
  >,
  FilterFieldTypes<MarkModelsNullableFieldsOptional<FieldsWithRelationships>>,
  FilterFieldTypes<ModelImpliedAuthFields<Schema>>
>;

export type ResolveStaticFieldProperties<
  Schema extends GenericModelSchema<any>,
  NonModelTypes extends NonModelTypesShape,
  ImplicitModelsSchema,
  ResolvedSchema = ResolveSchema<Schema>,
  FieldsWithInjectedImplicitFields = InjectImplicitModelFields<
    ResolvedSchema & ImplicitModelsSchema,
    object
  >,
  FieldsWithRelationships = ResolveModelsRelationalAndRefFields<
    FieldsWithInjectedImplicitFields,
    NonModelTypes
  >,
> = Intersection<
  FilterFieldTypes<
    MarkModelsNonNullableFieldsRequired<FieldsWithRelationships>
  >,
  FilterFieldTypes<MarkModelsNullableFieldsOptional<FieldsWithRelationships>>
>;

type GetRelationshipRef<
  T,
  RM extends keyof T,
  TypeArg extends ModelRelationalFieldParamShape,
  Flat extends boolean,
  ResolvedModel = ResolveRelationalFieldsForModel<T, RM, Flat>,
  Model = TypeArg['valueRequired'] extends true
    ? ResolvedModel
    : ResolvedModel | null | undefined,
> = LazyLoader<Model, TypeArg['array']>;

type ResolveRelationalFieldsForModel<
  Schema,
  ModelName extends keyof Schema,
  Flat extends boolean,
> = {
  [FieldName in keyof Schema[ModelName]]: Schema[ModelName][FieldName] extends ModelRelationalFieldParamShape
    ? Schema[ModelName][FieldName]['relatedModel'] extends keyof Schema
      ? GetRelationshipRef<
          Schema,
          Schema[ModelName][FieldName]['relatedModel'],
          Schema[ModelName][FieldName],
          Flat
        >
      : never
    : Schema[ModelName][FieldName];
};

// Ref can point to a customType, enum, or custom operation
export type ResolveRef<
  NonModelTypes extends NonModelTypesShape,
  Ref extends RefTypeParamShape,
  Link extends string = Ref['link'],
  RefValue = Link extends keyof NonModelTypes['enums']
    ? NonModelTypes['enums'][Link]
    : Link extends keyof NonModelTypes['customTypes']
      ? ResolveRefsOfCustomType<
          NonModelTypes,
          NonModelTypes['customTypes'][Link]
        >
      : never,
  Value = Ref['valueRequired'] extends true ? RefValue : RefValue | null,
> = ResolveRefValueArrayTraits<Ref, Value>;

/**
 * Converts the resolved RefType Value type into Array<> according to the
 * `array` and `arrayRequired` properties of the RefType
 */
export type ResolveRefValueArrayTraits<
  Ref extends RefTypeParamShape,
  Value,
> = Ref['array'] extends false
  ? Value
  : Ref['arrayRequired'] extends true
    ? Array<Value>
    : Array<Value> | null;

export type ResolveRefsOfCustomType<
  NonModelTypes extends NonModelTypesShape,
  T,
> = {
  [Prop in keyof T]: T[Prop] extends RefType<
    infer R extends RefTypeParamShape,
    any,
    any
  > | null
    ? ResolveRef<NonModelTypes, R>
    : T[Prop];
} extends infer Resolved
  ? ResolveCustomTypeFieldsRequirements<Resolved>
  : never;

export type ResolveCustomTypeFieldsRequirements<Resolved> = Intersection<
  ExtractNullableFieldsToOptionalFields<Resolved>,
  ExtractNonNullableFieldsToRequiredFields<Resolved>
>;

type ResolveModelsRelationalAndRefFields<
  Schema,
  NonModelTypes extends NonModelTypesShape,
  Flat extends boolean = false,
> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp]]: Schema[ModelProp][FieldProp] extends RefType<
      infer R extends RefTypeParamShape,
      any,
      any
    > | null
      ? ResolveRef<NonModelTypes, R>
      : Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
        ? Schema[ModelProp][FieldProp]['relatedModel'] extends keyof Schema
          ? Schema[ModelProp][FieldProp]['relationshipType'] extends 'manyToMany'
            ? Schema[ModelProp][FieldProp]['relationName'] extends keyof Schema
              ? GetRelationshipRef<
                  Schema,
                  Schema[ModelProp][FieldProp]['relationName'],
                  Schema[ModelProp][FieldProp],
                  Flat
                >
              : never
            : GetRelationshipRef<
                Schema,
                Schema[ModelProp][FieldProp]['relatedModel'],
                Schema[ModelProp][FieldProp],
                Flat
              >
          : never // if the field value extends ModelRelationalFieldShape "relatedModel" should always point to a Model (keyof Schema)
        : Schema[ModelProp][FieldProp];
  };
};

type FilterFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends undefined
      ? never
      : FieldProp]: Schema[ModelProp][FieldProp];
  };
};

type ExtractNullableFieldsToOptionalFields<Fields> = Partial<{
  [FieldProp in keyof Fields as null extends Fields[FieldProp]
    ? FieldProp
    : never]: null extends Fields[FieldProp] ? Fields[FieldProp] : never;
}>;

type MarkModelsNullableFieldsOptional<Schema> = {
  [ModelProp in keyof Schema]: ExtractNullableFieldsToOptionalFields<
    Schema[ModelProp]
  >;
};

type ExtractNonNullableFieldsToRequiredFields<Fields> = {
  [FieldProp in keyof Fields as null extends Fields[FieldProp]
    ? never
    : FieldProp]: null extends Fields[FieldProp] ? never : Fields[FieldProp];
};

type MarkModelsNonNullableFieldsRequired<Schema> = {
  [ModelProp in keyof Schema]: ExtractNonNullableFieldsToRequiredFields<
    Schema[ModelProp]
  >;
};

type Intersection<
  A = Record<never, never>,
  B = Record<never, never>,
  C = Record<never, never>,
  D = Record<never, never>,
> = A & B & C & D extends infer U ? { [P in keyof U]: U[P] } : never;

// TODO: this should probably happen in InjectImplicitModelFields instead. Keeping here for now to reduce refactor
// blast radius
export type ModelImpliedAuthFields<Schema extends GenericModelSchema<any>> = {
  [ModelKey in keyof Schema['data']['types'] as Schema['data']['types'][ModelKey] extends EnumType<EnumTypeParamShape>
    ? never
    : Schema['data']['types'][ModelKey] extends CustomType<CustomTypeParamShape>
      ? never
      : Schema['data']['types'][ModelKey] extends CustomOperation<
            CustomOperationParamShape,
            any
          >
        ? never
        : ModelKey]: Schema['data']['types'][ModelKey] extends ModelType<
    infer Model,
    any
  >
    ? AllAuthFieldsForModel<Schema, Model>
    : object;
};

type AllAuthFieldsForModel<
  Schema extends GenericModelSchema<any>,
  Model extends Schema['data']['types'][keyof Schema['data']['types']],
> = (Model['authorization'][number] extends never
  ? Schema['data']['authorization'][number] extends never
    ? object
    : ImpliedAuthFields<Schema['data']['authorization'][number]>
  : ImpliedAuthFields<Model['authorization'][number]>) &
  ImpliedAuthFieldsFromFields<Model>;

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationalField<any, any, any, infer Auth>
        | RefType<any, any, infer Auth>
      ? Auth extends Authorization<any, any, any>
        ? ImpliedAuthFields<Auth>
        : object
      : object
    : object
>;
