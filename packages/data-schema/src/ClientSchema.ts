import { type Prettify, __modelMeta__ } from '@aws-amplify/data-schema-types';
import type { ModelSchema } from './ModelSchema';

// MappedTypes
import type { ResolveSchema, SchemaTypes } from './MappedTypes/ResolveSchema';
import type { ResolveFieldProperties } from './MappedTypes/ResolveFieldProperties';
import type {
  ModelIdentifier,
  ModelSecondaryIndexes,
  RelationalMetadata,
} from './MappedTypes/ModelMetadata';
import type {
  ExtractNonModelTypes,
  NonModelTypesShape,
} from './MappedTypes/ExtractNonModelTypes';

export type ClientSchema<Schema extends ModelSchema<any, any>> =
  InternalClientSchema<Schema>;

/**
 * Types for unwrapping generic type args into client-consumable types
 *
 * @typeParam Schema - Type Beast schema type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @internal @typeParam ResolvedSchema - Schema/Models/Fields structure with generic type args extracted
 * @internal @typeParam IdentifierMeta - Stores model identifier
 * @internal @typeParam ResolvedFields - optionality enforced on nullable types (+?); These are the client-facing types used for CRUDL response shapes
 *
 * @internal @typeParam Meta - Stores schema metadata: identifier, relationship metadata;
 * used by `API.generateClient` to craft strongly typed mutation inputs; hidden from customer-facing types behind __modelMeta__ symbol
 *
 */
type InternalClientSchema<
  Schema extends ModelSchema<any, any>,
  NonModelTypes extends NonModelTypesShape = ExtractNonModelTypes<Schema>,
  ResolvedSchema = ResolveSchema<Schema>,
  IdentifierMeta extends Record<string, any> = ModelIdentifier<
    SchemaTypes<Schema>
  >,
  SecondaryIndexes extends Record<string, any> = ModelSecondaryIndexes<
    SchemaTypes<Schema>
  >,
  ResolvedFields extends Record<string, unknown> = ResolveFieldProperties<
    Schema,
    NonModelTypes
  >,
  RelationshipMeta = RelationalMetadata<
    ResolvedSchema,
    ResolvedFields,
    IdentifierMeta
  >,
  Meta = IdentifierMeta & SecondaryIndexes & RelationshipMeta & NonModelTypes,
> = Prettify<
  ResolvedFields & {
    [__modelMeta__]: Meta;
  }
>;
