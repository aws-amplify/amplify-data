export { type __modelMeta__ } from '@aws-amplify/data-schema-types';
export type { ModelSchema } from '../../ModelSchema';

// MappedTypes used by ClientSchema
export type {
  ResolveSchema,
  SchemaTypes,
} from '../../MappedTypes/ResolveSchema';
export type {
  CreateImplicitModelsFromRelations,
  ResolveFieldProperties,
} from '../../MappedTypes/ResolveFieldProperties';
export type {
  ModelIdentifier,
  ModelSecondaryIndexes,
  RelationalMetadata,
} from '../../MappedTypes/ModelMetadata';
export type {
  ExtractNonModelTypes,
  NonModelTypesShape,
} from '../../MappedTypes/ExtractNonModelTypes';
export type { ResolveCustomOperations } from '../../MappedTypes/CustomOperations';
