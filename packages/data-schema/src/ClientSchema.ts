import type { __modelMeta__ } from './runtime/client';
import type {
  BaseSchema,
  CustomOperation,
  CustomType,
  EnumType,
  GenericModelSchema,
  ModelSchemaContents,
  ModelType,
  RDSModelSchema,
} from './ModelSchema';

// MappedTypes
import type { ResolveSchema, SchemaTypes } from './MappedTypes/ResolveSchema';
import type {
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
import type {
  // ResolveCustomOperations,
  // CustomOperationHandlerTypes,
  CustomHandlerTypes,
} from './MappedTypes/CustomOperations';
import type {
  CombinedModelSchema,
  CombinedSchemaIndexesUnion,
} from './CombineSchema';
import type { Brand, SpreadTuple } from './util';

import { a } from './index';

const schema = a.schema({
  Status: a.enum(['a', 'b', 'c']),
  LikeResult: a.customType({
    likes: a.integer().required(),
  }),
  likePost: a
    .mutation()
    .arguments({
      postId: a.string().required(),
    })
    .returns(a.ref('LikeResult'))
    .handler(a.handler.function('likePost'))
    .authorization((allow) => allow.publicApiKey()),

  likeAllPosts: a
    .mutation()
    .returns(a.ref('LikeResult').array())
    .handler(a.handler.function('likeAllPosts'))
    .authorization((allow) => allow.publicApiKey()),

  Post: a
    .model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
      updatedAt: a.string(),
    })
    .secondaryIndexes((index) => [
      index('title'),
      index('description')
        .queryField('myCustomIdx')
        .sortKeys(['updatedAt', 'viewCount']),
    ]),
});

export type ClientSchema<
  Schema extends GenericModelSchema<any> | CombinedModelSchema<any>,
> =
  Schema extends GenericModelSchema<any>
    ? InternalClientSchema<Schema>
    : Schema extends CombinedModelSchema<any>
      ? InternalCombinedSchema<Schema>
      : never;

type InternalClientSchema<CustomerSchema extends BaseSchema<any, any>> = {
  [K in keyof CustomerSchema['data']['types']]: ClientSchemaProperty<
    CustomerSchema,
    K
  >;
};

type ClientSchemaProperty<T extends BaseSchema<any, any>, K extends keyof T> =
  T['data']['types'][K] extends Brand<'enum'>
    ? RemapEnum<T, T['data']['types'][K]>
    : T['data']['types'] extends Brand<'customType'>
      ? RemapCustomType<T, T['data']['types'][K]>
      : T['data']['types'] extends Brand<
            | 'queryCustomOperation'
            | 'mutationCustomOperation'
            | 'subscriptionCustomOperation'
          >
        ? RemapCustomOperation<T, T['data']['types'][K]>
        : RemapModel<T, T['data']['types'][K]>;

type RemapEnum<_T extends BaseSchema<any, any>, E> =
  E extends EnumType<infer ET>
    ? {
        __entityType: 'enum';
        type: ET['values'][number];
      }
    : 'a';

type RemapCustomType<_T extends BaseSchema<any, any>, E> =
  E extends CustomType<infer CT>
    ? {
        __entityType: 'customType';
        type: CT;
      }
    : 'b';

type RemapCustomOperation<T extends BaseSchema<any, any>, E> =
  E extends CustomOperation<infer CO, any>
    ? {
        __entityType: 'customOperation';
        type: CustomHandlerTypes<InternalClientSchema<T>, CO>;
      }
    : 'c';

type RemapModel<_T extends BaseSchema<any, any>, E> =
  E extends ModelType<infer MT, any>
    ? {
        __entityType: 'model';
        type: MT;
      }
    : 'd';

type _Schema = InternalClientSchema<typeof schema>;
type _T = _Schema['LikeResult'];

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
 * @internal @typeParam ResolvedFields - Resolved client-facing types used for CRUDL response shapes
 * @internal @typeParam IdentifierMeta - Resolve the identifier fields for all models
 * @internal @typeParam SecondaryIndexes - Map of model secondary index metadata
 */
// type _InternalClientSchema<
//   Schema extends GenericModelSchema<any>,
//   NonModelTypes extends NonModelTypesShape = ExtractNonModelTypes<Schema>,
//   ResolvedSchema = ResolveSchema<Schema>,
//   ResolvedFields extends Record<
//     string,
//     unknown
//   > = Schema extends RDSModelSchema<any, any>
//     ? ResolveStaticFieldProperties<Schema, NonModelTypes, object>
//     : ResolveFieldProperties<Schema, NonModelTypes>,
//   IdentifierMeta extends Record<string, any> = ModelIdentifier<
//     SchemaTypes<Schema>
//   >,
//   SecondaryIndexes extends Record<string, any> = Schema extends RDSModelSchema<
//     any,
//     any
//   >
//     ? object
//     : ModelSecondaryIndexes<SchemaTypes<Schema>>,
// > = CustomOperationHandlerTypes<
//   ResolveCustomOperations<
//     Schema,
//     ResolvedFields,
//     NonModelTypes
//   >['customOperations']
// > & {
//   [K in keyof ResolvedFields]: {
//     type: ResolvedFields[K];
//   };
// } & {
//   [__modelMeta__]: IdentifierMeta &
//     SecondaryIndexes &
//     RelationalMetadata<ResolvedSchema, ResolvedFields, IdentifierMeta> &
//     NonModelTypes &
//     ResolveCustomOperations<Schema, ResolvedFields, NonModelTypes>;
// };

type GetInternalClientSchema<Schema> =
  Schema extends GenericModelSchema<any> ? InternalClientSchema<Schema> : never;

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
    ? Omit<ClientSchemas[I], typeof __modelMeta__>
    : never;
}> & {
  [__modelMeta__]: SpreadTuple<{
    [I in keyof ClientSchemas]: I extends CombinedSchemaIndexesUnion
      ? ClientSchemas[I][typeof __modelMeta__]
      : never;
  }>;
};
