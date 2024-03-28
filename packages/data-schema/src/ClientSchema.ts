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
import {
  CombinedModelSchema,
  CombinedSchemaIndexesUnion,
} from './CombineSchema';
import { SpreadTuple } from './util';

/**
 * test
 */
export type ClientSchema<
  Schema extends GenericModelSchema<any> | CombinedModelSchema<any>,
> = Schema extends GenericModelSchema<any>
  ? InternalClientSchema<Schema>
  : Schema extends CombinedModelSchema<any>
    ? InternalCombinedSchema<Schema>
    : never;

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
 * @internal @typeParam IdentifierMeta - Resolve the identifier fields for all models
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

type GetInternalClientSchema<Schema> = Schema extends GenericModelSchema<any>
  ? InternalClientSchema<Schema>
  : never;

type CombinedClientSchemas<
  Schemas extends CombinedModelSchema<any>['schemas'],
> = {
  [Index in keyof Schemas]: Index extends CombinedSchemaIndexesUnion
    ? GetInternalClientSchema<Schemas[Index]>
    : never;
};

/**
 * Types for unwrapping and combining generic type args into client-consumable types
 * for multiple schemas
 *
 * @typeParam Combined - A container of multiple schemas
 *
 * @internal @typeParam ClientSchemas - The tuple of client schemas to combine
 */
type InternalCombinedSchema<
  Combined extends CombinedModelSchema<any>,
  ClientSchemas extends [...any] = CombinedClientSchemas<Combined['schemas']>,
> = SpreadTuple<{
  [I in keyof ClientSchemas]: I extends CombinedSchemaIndexesUnion
    ? Exclude<ClientSchemas[I], typeof __modelMeta__>
    : never;
}> & {
  [__modelMeta__]: SpreadTuple<{
    [I in keyof ClientSchemas]: I extends CombinedSchemaIndexesUnion
      ? ClientSchemas[I][typeof __modelMeta__]
      : never;
  }>;
};
