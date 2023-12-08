import type {
  UnionToIntersection,
  LazyLoader,
  ExcludeEmpty,
} from '@aws-amplify/data-schema-types';
import type { Authorization, ImpliedAuthFields } from '../Authorization';
import type { ModelField } from '../ModelField';
import type { ModelType, ModelTypeParamShape } from '../ModelType';
import type { ModelSchema } from '../ModelSchema';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
  ModelRelationalTypeArgFactory,
} from '../ModelRelationalField';
import type { AllImpliedFKs } from './ForeignKeys';

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
  Schema extends ModelSchema<any, any>,
  NonModelTypes extends NonModelTypesShape,
  ResolvedSchema = ResolveSchema<Schema>,
  IdentifierMeta extends Record<
    string,
    { identifier: string }
  > = ModelIdentifier<SchemaTypes<Schema>>,
  FieldsWithInjectedModels = InjectImplicitModels<ResolvedSchema>,
  FieldsWithInjectedImplicitFields = InjectImplicitModelFields<
    FieldsWithInjectedModels,
    IdentifierMeta
  >,
  FieldsWithRelationships = ResolveRelationships<
    FieldsWithInjectedImplicitFields,
    NonModelTypes
  >,
> = Intersection<
  FilterFieldTypes<RequiredFieldTypes<FieldsWithRelationships>>,
  FilterFieldTypes<OptionalFieldTypes<FieldsWithRelationships>>,
  FilterFieldTypes<ModelImpliedAuthFields<Schema>>,
  AllImpliedFKs<ResolvedSchema, IdentifierMeta>
>;

type ExtractImplicitModelNames<Schema> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
          ? Schema[ModelProp][FieldProp]['relationName'] extends string
            ? Schema[ModelProp][FieldProp]['relationName'] extends keyof Schema
              ? never
              : Schema[ModelProp][FieldProp]['relationName']
            : never
          : never]: { id?: string } & Record<
          `${Lowercase<ModelProp & string>}`,
          ModelRelationalTypeArgFactory<ModelProp & string, 'hasMany', false>
        >; // implicit model will always have id: string as the PK
      };
    }[keyof Schema]
  >
>;

type InjectImplicitModels<Schema> = Schema & ExtractImplicitModelNames<Schema>;

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
type ResolveRef<
  NonModelTypes extends NonModelTypesShape,
  Ref extends RefTypeParamShape,
  Link extends string = Ref['link'],
  Value = Link extends keyof NonModelTypes['enums']
    ? NonModelTypes['enums'][Link]
    : Link extends keyof NonModelTypes['customTypes']
      ? NonModelTypes['customTypes'][Link]
      : never,
> = Ref['required'] extends true ? Value : Value | null;

type ResolveRelationships<
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

type OptionalFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: Partial<{
    [FieldProp in keyof Schema[ModelProp]]: null extends Schema[ModelProp][FieldProp]
      ? Schema[ModelProp][FieldProp]
      : never;
  }>;
};

type RequiredFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp]]: null extends Schema[ModelProp][FieldProp]
      ? never
      : Schema[ModelProp][FieldProp];
  };
};

type Intersection<A, B, C, D> = A & B & C & D extends infer U
  ? { [P in keyof U]: U[P] }
  : never;

// TODO: this should probably happen in InjectImplicitModelFields instead. Keeping here for now to reduce refactor
// blast radius
export type ModelImpliedAuthFields<Schema extends ModelSchema<any, any>> = {
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
  Schema extends ModelSchema<any, any>,
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
