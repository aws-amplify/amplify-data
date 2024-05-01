import type { __modelMeta__ } from '../runtime/client';
import type {
  BaseSchema,
  CustomOperation,
  CustomType,
  EnumType,
  GenericModelSchema,
  ModelSchemaContents,
  ModelType,
  RDSModelSchema,
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
import type { Brand, SpreadTuple } from '../util';

import { a } from '../index';

const schema = a.schema({
  Status: a.enum(['a', 'b', 'c']),

  getStatus: a
    .query()
    .arguments({
      postId: a.id(),
    })
    .returns(a.ref('Status')),

  echo: a
    .query()
    .arguments({
      message: a.string(),
    })
    .returns(a.string()),

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
      comments: a.hasMany('Comment', 'postId'),
    })
    .secondaryIndexes((index) => [
      index('title'),
      index('description')
        .queryField('myCustomIdx')
        .sortKeys(['updatedAt', 'viewCount']),
    ])
    .authorization((allow) => [allow.publicApiKey()]),

  Comment: a
    .model({
      body: a.string().required(),
      postId: a.id(),
      post: a.belongsTo('Post', 'postId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type ClientSchema<
  Schema extends GenericModelSchema<any> | CombinedModelSchema<any>,
> =
  Schema extends GenericModelSchema<any>
    ? InternalClientSchema<Schema>
    : Schema extends CombinedModelSchema<any>
      ? InternalCombinedSchema<Schema>
      : never;

type InternalClientSchema<
  CustomerSchema extends ModelSchemaContents | BaseSchema<any, any>,
> = CustomerSchema extends ModelSchemaContents
  ? {
      [K in keyof CustomerSchema]: ClientSchemaProperty<CustomerSchema, K>;
    }
  : InternalClientSchema<CustomerSchema['data']['types']>;

type ClientSchemaProperty<T extends ModelSchemaContents, K extends keyof T> =
  T[K] extends Brand<'enum'>
    ? RemapEnum<T, T[K]>
    : T[K] extends Brand<'customType'>
      ? RemapCustomType<T, T[K]>
      : T[K] extends Brand<
            | 'queryCustomOperation'
            | 'mutationCustomOperation'
            | 'subscriptionCustomOperation'
          >
        ? RemapCustomOperation<T, T[K]>
        : T[K] extends Brand<'modelType'>
          ? RemapModel<T, T[K]>
          : never;

type RemapEnum<_T extends ModelSchemaContents, E> =
  E extends EnumType<infer ET> ? ClientEnum<ET> : 'a';

type RemapCustomType<T extends ModelSchemaContents, E> =
  E extends CustomType<infer CT>
    ? ClientCustomType<InternalClientSchema<T>, CT>
    : 'b';

type RemapCustomOperation<T extends ModelSchemaContents, E> =
  E extends CustomOperation<infer CO, any>
    ? ClientCustomOperation<InternalClientSchema<T>, CO>
    : 'c';

type RemapModel<T extends ModelSchemaContents, E> =
  E extends ModelType<infer MT, any>
    ? ClientModel<InternalClientSchema<T>, MT>
    : 'd';

type _Schema = InternalClientSchema<typeof schema>;
type _T = _Schema['Post']['type'];

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
}>;
