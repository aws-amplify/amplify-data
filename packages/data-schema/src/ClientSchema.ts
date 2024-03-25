import { type __modelMeta__ } from '@aws-amplify/data-schema-types';
import { type GenericModelSchema, type RDSModelSchema } from './ModelSchema';

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

export type ClientSchema<Schema extends GenericModelSchema<any>> =
  InternalClientSchema<Schema>;

/**
 * Types for unwrapping generic type args into client-consumable types
 *
 * @typeParam Schema - Data schema builder model type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @internal @typeParam NonModelTypes - Custom Types, Enums, and Custom Operations
 * @internal @typeParam ResolvedSchema - Resolve the schema types used by other generics
 * @internal @typeParam ImplicitModels - The implicit models created to represent relationships
 * @internal @typeParam ImplicitModelsIdentifierMeta - The implicite model identifiers derived from ImplicitModels
 * @internal @typeParam ResolvedFields - Resolved client-facing types used for CRUDL response shapes
 * @internal @typeParam SecondaryIndexes - Map of model secondary index metadata
 */
type InternalClientSchema<
  Schema extends GenericModelSchema<any>,
  NonModelTypes extends NonModelTypesShape = ExtractNonModelTypes<Schema>,
  ResolvedSchema = ResolveSchema<Schema>,
  ImplicitModels = Schema extends RDSModelSchema<any, any>
    ? object
    : CreateImplicitModelsFromRelations<ResolvedSchema>,
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
    : ResolveFieldProperties<Schema, NonModelTypes, ImplicitModels>,
> = InternalClientSchemaEntries<Schema, NonModelTypes, ResolvedFields> & {
  [__modelMeta__]: InternalClientSchemaMetadata<
    Schema,
    NonModelTypes,
    ResolvedSchema,
    ImplicitModelsIdentifierMeta,
    ResolvedFields
  >;
};

/**
 * Types for expanding into client-consumable types
 *
 * @typeParam Schema - Data schema builder model type
 * @typeParam NonModelTypes - Custom Types, Enums, and Custom Operations
 * @typeParam ResolvedFields - Resolved client-facing types used for CRUDL response shapes
 */
type InternalClientSchemaEntries<
  Schema extends GenericModelSchema<any>,
  NonModelTypes extends NonModelTypesShape,
  ResolvedFields extends Record<string, unknown>,
> = CustomOperationHandlerTypes<
  ResolveCustomOperations<
    Schema,
    ResolvedFields,
    NonModelTypes
  >['customOperations']
> &
  ResolvedFields;

/**
 * Types for expanding into client-consumable metadata types
 *
 * @typeParam Schema - Data schema builder model type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @internal @typeParam NonModelTypes - Custom Types, Enums, and Custom Operations
 * @internal @typeParam ResolvedSchema - Resolve the schema types used by other generics
 * @internal @typeParam ImplicitModelsIdentifierMeta - The implicite model identifiers derived from ImplicitModels
 * @internal @typeParam ResolvedFields - Resolved client-facing types used for CRUDL response shapes
 * @internal @typeParam IdentifierMeta - Resolve the identifier fields for all models
 * @internal @typeParam SecondaryIndexes - Map of model secondary index metadata
 */
type InternalClientSchemaMetadata<
  Schema extends GenericModelSchema<any>,
  NonModelTypes extends NonModelTypesShape,
  ResolvedSchema,
  ImplicitModelsIdentifierMeta,
  ResolvedFields extends Record<string, unknown>,
  IdentifierMeta extends Record<string, any> = ModelIdentifier<
    SchemaTypes<Schema>
  >,
  SecondaryIndexes extends Record<string, any> = Schema extends RDSModelSchema<
    any,
    any
  >
    ? object
    : ModelSecondaryIndexes<SchemaTypes<Schema>>,
> = IdentifierMeta &
  ImplicitModelsIdentifierMeta &
  SecondaryIndexes &
  RelationalMetadata<ResolvedSchema, ResolvedFields, IdentifierMeta> &
  NonModelTypes &
  ResolveCustomOperations<Schema, ResolvedFields, NonModelTypes>;
