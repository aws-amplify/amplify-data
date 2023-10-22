import type {
  UnionToIntersection,
  LazyLoader,
  ExcludeEmpty,
} from '@aws-amplify/amplify-api-next-types-alpha';
import type { Authorization, ImpliedAuthFields } from '../Authorization';
import type { ModelField } from '../ModelField';
import type { ModelType, ModelTypeParamShape } from '../ModelType';
import type { ModelSchema } from '../ModelSchema';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
  ModelRelationalTypeArgFactory,
} from '../ModelRelationalField';

import type { ResolveSchema, SchemaTypes } from './ResolveSchema';
import type { InjectImplicitModelFields } from './ImplicitFieldInjector';
import type { ModelIdentifier } from './ModelMetadata';
import type { RefType, RefTypeParamShape } from '../RefType';

import type { NonModelTypesShape } from './ExtractNonModelTypes';

import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';

export type ResolveFieldProperties<
  Schema extends ModelSchema<any>,
  NonModelTypes extends NonModelTypesShape,
  ResolvedSchema = ResolveSchema<Schema>,
  IdentifierMeta = ModelIdentifier<SchemaTypes<Schema>>,
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
  FilterFieldTypes<ModelImpliedAuthFields<Schema>>
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
> = Link extends keyof NonModelTypes['enums']
  ? NonModelTypes['enums'][Link]
  : Link extends keyof NonModelTypes['customTypes']
  ? NonModelTypes['customTypes'][Link]
  : never;

type ResolveRelationships<
  Schema,
  NonModelTypes extends NonModelTypesShape,
  Flat extends boolean = false,
> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp]]: Schema[ModelProp][FieldProp] extends RefType<
      infer R extends RefTypeParamShape,
      'ref'
    >
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

type Intersection<A, B, C> = A & B & C extends infer U
  ? { [P in keyof U]: U[P] }
  : never;

// TODO: this should probably happen in InjectImplicitModelFields instead. Keeping here for now to reduce refactor
// blast radius
type ModelImpliedAuthFields<Schema extends ModelSchema<any>> = {
  [ModelKey in keyof Schema['data']['models'] as Schema['data']['models'][ModelKey] extends EnumType<EnumTypeParamShape>
    ? never
    : Schema['data']['models'][ModelKey] extends CustomType<CustomTypeParamShape>
    ? never
    : ModelKey]: Schema['data']['models'][ModelKey] extends ModelType<
    infer Model,
    any
  >
    ? ImpliedAuthFields<Model['authorization'][number]> &
        ImpliedAuthFieldsFromFields<Model>
    : object;
};

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationalField<any, any, any, infer Auth>
      ? Auth extends Authorization<any, any>
        ? ImpliedAuthFields<Auth>
        : object
      : object
    : object
>;
