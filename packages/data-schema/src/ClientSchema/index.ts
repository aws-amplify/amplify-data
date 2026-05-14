import type { __modelMeta__ } from '../runtime/client';
import type {
  BaseSchema,
  ClientSchemaOptions,
  ConversationType,
  CustomOperation,
  CustomType,
  EnumType,
  GenericModelSchema,
  ModelSchemaContents,
  ModelType,
} from '../ModelSchema';

import type {
  ClientCustomOperation,
  ClientCustomType,
  ClientEnum,
  ClientModel,
} from './Core';
import type {
  CombinedModelSchema,
  CombinedSchemaIndexesUnion,
} from '../CombineSchema';
import type { SchemaMetadata } from './utilities/SchemaMetadata';
import type { Brand, Select, SpreadTuple } from '../util';
import { ClientConversation } from './ai/ClientConversation';

export type { ClientSchemaOptions } from '../ModelSchema';

export type ClientSchema<
  Schema extends GenericModelSchema<any> | CombinedModelSchema<any>,
  Options extends ClientSchemaOptions = ClientSchemaOptions,
> =
  Schema extends GenericModelSchema<any>
    ? InternalClientSchema<Schema, Options>
    : Schema extends CombinedModelSchema<any>
      ? InternalCombinedSchema<Schema, Options>
      : never;

type InternalClientSchema<
  CustomerSchema extends ModelSchemaContents | BaseSchema<any, any>,
  Options extends ClientSchemaOptions = ClientSchemaOptions,
  Metadata extends SchemaMetadata<any, any> = never,
  IsRDS extends boolean = never,
> = CustomerSchema extends ModelSchemaContents
  ? {
      [K in keyof CustomerSchema as K extends string
        ? K
        : never]: K extends string
        ? ClientSchemaProperty<CustomerSchema, Metadata, IsRDS, K>
        : never;
    }
  : CustomerSchema extends BaseSchema<any, any>
    ? InternalClientSchema<
        CustomerSchema['data']['types'],
        Options,
        SchemaMetadata<CustomerSchema, Options>,
        CustomerSchema extends Brand<'RDSSchema'> ? true : false
      >
    : never;

type ClientSchemaProperty<
  T extends ModelSchemaContents,
  Metadata extends SchemaMetadata<any, any>,
  IsRDS extends boolean,
  K extends keyof T & string,
> =
  T[K] extends Brand<'enum'>
    ? RemapEnum<T, T[K]>
    : T[K] extends Brand<'customType'>
      ? RemapCustomType<T, Metadata, IsRDS, T[K]>
      : T[K] extends Brand<
            | 'queryCustomOperation'
            | 'mutationCustomOperation'
            | 'subscriptionCustomOperation'
            | 'generationCustomOperation'
          >
        ? RemapCustomOperation<T, Metadata, IsRDS, T[K]>
        : T[K] extends Brand<'modelType'>
          ? RemapModel<T, Metadata, IsRDS, T[K], K>
          : T[K] extends Brand<'conversationCustomOperation'>
            ? RemapAIRoute<T, T[K]>
            : never;

type RemapEnum<_T extends ModelSchemaContents, E> =
  E extends EnumType<infer values> ? ClientEnum<values> : never;

type RemapCustomType<
  T extends ModelSchemaContents,
  Metadata extends SchemaMetadata<any, any>,
  IsRDS extends boolean,
  E,
> =
  E extends CustomType<infer CT>
    ? ClientCustomType<InternalClientSchema<T, ClientSchemaOptions, Metadata, IsRDS>, CT>
    : never;

type RemapCustomOperation<
  T extends ModelSchemaContents,
  Metadata extends SchemaMetadata<any, any>,
  IsRDS extends boolean,
  E,
> =
  E extends CustomOperation<infer CO, any>
    ? ClientCustomOperation<InternalClientSchema<T, ClientSchemaOptions, Metadata, IsRDS>, CO>
    : never;

type RemapModel<
  T extends ModelSchemaContents,
  Metadata extends SchemaMetadata<any, any>,
  IsRDS extends boolean,
  E,
  K extends keyof T & string,
> =
  E extends ModelType<infer MT, any>
    ? ClientModel<
        InternalClientSchema<T, ClientSchemaOptions, Metadata, IsRDS>,
        Metadata,
        IsRDS,
        MT,
        K
      >
    : never;

type RemapAIRoute<
  _T extends ModelSchemaContents,
  E,
> = E extends ConversationType ? ClientConversation : never;

type GetInternalClientSchema<
  Schema,
  Options extends ClientSchemaOptions = ClientSchemaOptions,
> = Schema extends GenericModelSchema<any>
  ? InternalClientSchema<Schema, Options>
  : never;

type CombinedClientSchemas<
  Schemas extends CombinedModelSchema<any>['schemas'],
  Options extends ClientSchemaOptions = ClientSchemaOptions,
> = {
  [Index in keyof Schemas]: Index extends CombinedSchemaIndexesUnion
    ? GetInternalClientSchema<Schemas[Index], Options>
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
  Options extends ClientSchemaOptions = ClientSchemaOptions,
  ClientSchemas extends [...any] = CombinedClientSchemas<Combined['schemas'], Options>,
> = SpreadTuple<{
  [I in keyof ClientSchemas]: I extends CombinedSchemaIndexesUnion
    ? Omit<ClientSchemas[I], typeof __modelMeta__>
    : never;
}>;

export type ClientSchemaByEntityTypeBaseShape = {
  enums: Record<string, ClientEnum<any>>;
  customTypes: Record<string, ClientCustomType<any, any>>;
  models: Record<string, ClientModel<any, any, any, any, any>>;
  queries: Record<string, ClientCustomOperation<any, any>>;
  mutations: Record<string, ClientCustomOperation<any, any>>;
  subscriptions: Record<string, ClientCustomOperation<any, any>>;
  conversations: Record<string, ClientConversation>;
  generations: Record<string, ClientCustomOperation<any, any>>;
};

export type ClientSchemaByEntityType<T> = {
  enums: Select<T, { __entityType: 'enum' }>;
  customTypes: Select<T, { __entityType: 'customType' }>;
  models: Select<T, { __entityType: 'model' }>;
  queries: Select<T, { __entityType: 'customQuery' }>;
  mutations: Select<T, { __entityType: 'customMutation' }>;
  subscriptions: Select<T, { __entityType: 'customSubscription' }>;
  conversations: Select<T, { __entityType: 'customConversation' }>;
  generations: Select<T, { __entityType: 'customGeneration' }>;
};
