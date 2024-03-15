import { type __modelMeta__ } from '@aws-amplify/data-schema-types';
import { RDSModelSchema, type ModelSchema } from './ModelSchema';

// MappedTypes
import type { ResolveSchema, SchemaTypes } from './MappedTypes/ResolveSchema';
import type {
  CreateImplicitModelsFromRelations,
  ResolveFieldProperties,
  ResolveStaticFieldProperties,
} from './MappedTypes/ResolveFieldProperties';
import type {
  ModelIdentifier,
  ModelSecondaryIndexes,
  RelationalMetadata,
} from './MappedTypes/ModelMetadata';
import type {
  ExtractNonModelTypes,
  NonModelTypesShape,
} from './MappedTypes/ExtractNonModelTypes';
import {
  ResolveCustomOperations,
  CustomOperationHandlerTypes,
} from './MappedTypes/CustomOperations';

export type ClientSchema<Schema extends ModelSchema<any, any>> =
  InternalClientSchema<Schema>;

// export type ClientSchema<Schema extends ModelSchema<any, any>> =
//   Schema extends RDSModelSchema<any, any>
//     ? InternalRDSClientSchema<Schema>
//     : InternalDDBClientSchema<Schema>;

/**
 * Types for unwrapping generic type args into client-consumable types
 *
 * @typeParam Schema - Data schema builder model type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @internal @typeParam NonModelTypes - Custom Types, Enums, and Custom Operations
 * @internal @typeParam ImplicitModels - The implicit models created to represent relationships
 * @internal @typeParam ResolvedFields - Resolved client-facing types used for CRUDL response shapes
 * @internal @typeParam SecondaryIndexes - Map of model secondary index metadata
 */
type InternalClientSchema<
  Schema extends ModelSchema<any, any>,
  NonModelTypes extends NonModelTypesShape = ExtractNonModelTypes<Schema>,
  ResolvedSchema = ResolveSchema<Schema>,
  ImplicitModels = CreateImplicitModelsFromRelations<ResolvedSchema>,
  ImplicitModelsIdentifierMeta = {
    [ImplicitModel in keyof ImplicitModels]: {
      identifier: 'id';
    };
  },
  ResolvedFields extends Record<
    string,
    unknown
  > = Schema extends RDSModelSchema<any, any>
    ? ResolveStaticFieldProperties<Schema, NonModelTypes, object>
    : ResolveFieldProperties<
        Schema,
        NonModelTypes,
        Schema extends RDSModelSchema<any, any> ? object : ImplicitModels
      >,
  IdentifierMeta extends Record<string, any> = ModelIdentifier<
    SchemaTypes<Schema>
  >,
  SecondaryIndexes extends Record<string, any> = Schema extends RDSModelSchema<
    any,
    any
  >
    ? object
    : ModelSecondaryIndexes<SchemaTypes<Schema>>,
> = CustomOperationHandlerTypes<
  ResolveCustomOperations<
    Schema,
    ResolvedFields,
    NonModelTypes
  >['customOperations']
> &
  ResolvedFields & {
    [__modelMeta__]: IdentifierMeta &
      ImplicitModelsIdentifierMeta &
      SecondaryIndexes &
      RelationalMetadata<ResolvedSchema, ResolvedFields, IdentifierMeta> &
      NonModelTypes &
      ResolveCustomOperations<Schema, ResolvedFields, NonModelTypes>;
  };
