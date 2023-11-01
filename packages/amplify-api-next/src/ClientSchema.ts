import {
  type Prettify,
  __modelMeta__,
} from '@aws-amplify/amplify-api-next-types-alpha';
import type { ModelSchema } from './ModelSchema';

// MappedTypes
import type { ResolveSchema, SchemaTypes } from './MappedTypes/ResolveSchema';
import type { ResolveFieldProperties } from './MappedTypes/ResolveFieldProperties';
import type {
  ModelIdentifier,
  RelationalMetadata,
  ExtractExplicitScalarFields,
} from './MappedTypes/ModelMetadata';

export type ClientSchema<Schema extends ModelSchema<any>> =
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
  Schema extends ModelSchema<any>,
  ResolvedSchema = ResolveSchema<Schema>,
  IdentifierMeta = ModelIdentifier<SchemaTypes<Schema>>,
  ExplicitScalarFields = ExtractExplicitScalarFields<Schema>,
  ResolvedFields extends Record<
    string,
    unknown
  > = ResolveFieldProperties<Schema>,
  RelationshipMeta = RelationalMetadata<ResolvedSchema, ResolvedFields>,
  Meta = IdentifierMeta & RelationshipMeta & ExplicitScalarFields,
> = Prettify<
  ResolvedFields & {
    [__modelMeta__]: Meta;
  }
>;
