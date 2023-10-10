import type { ModelField } from '../ModelField';
import type { ModelType } from '../ModelType';

/* Testing area */
import type { ModelSchema } from '../ModelSchema';
import type { ModelRelationalField } from '../ModelRelationalField';

import { a } from '../../index';
import { Prettify } from '../util';

const schema = a.schema({
  Todo: a.model({
    title: a.string(),
    createdAt: a.string(),
    updatedAt: a.string(),
  }),
});

type _InjectedTest = Prettify<
  InjectImplicitModelFields<FlattenedSchema, IdentifierMeta>
>;

type TSchema = typeof schema;
type FlattenedSchema = FieldTypes<ModelTypes<SchemaTypes<TSchema>>>;
type SchemaTypes<T> = T extends ModelSchema<infer R> ? R['models'] : never;

export type ModelTypes<Schema> = {
  [Property in keyof Schema]: Schema[Property] extends ModelType<infer R, any>
    ? R['fields']
    : never;
};
type FieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends ModelRelationalField<
      infer R,
      string,
      never,
      any
    >
      ? R
      : T[ModelProp][FieldProp] extends ModelField<infer R, any, any>
      ? R
      : never;
  };
};

type IdentifierMeta = ModelMeta<SchemaTypes<TSchema>>;

type ModelMeta<T> = {
  [Property in keyof T]: T[Property] extends ModelType<infer R, any>
    ? // reduce back to union
      R['identifier'] extends any[]
      ? { identifier: R['identifier'][number] }
      : never
    : never;
};

/* End testing area */

type DefaultIdentifierFields = {
  // implicit `id` is readonly because it's managed by the resolver; explicit `id` is writable
  readonly id: string;
};

type DefaultTimestampFields = {
  readonly createdAt: string;
  readonly updatedAt: string;
};

type InitialImplicitFields<Identifier> = Identifier extends 'id'
  ? DefaultIdentifierFields & DefaultTimestampFields
  : DefaultTimestampFields;

/**
 * @returns true if a string union `ExplicitFieldNames` contains a given string `FieldName`
 */
type FieldExists<
  ExplicitFieldNames extends string,
  FieldName extends string,
> = Extract<ExplicitFieldNames, FieldName> extends never ? false : true;

/**
 * @returns union of explicitly defined field names for a model
 */
type GetModelFieldNames<FlatModel> = FlatModel extends Record<infer R, any>
  ? R
  : never;

/**
 * Generate Record type containing all implicit fields for a given model
 */
type ImplicitFields<
  FlatModel,
  Identifier,
  ModelFieldNames = GetModelFieldNames<FlatModel>,
> = {
  [ImplicitField in keyof InitialImplicitFields<Identifier> as FieldExists<
    ModelFieldNames & string,
    ImplicitField & string
  > extends true
    ? never
    : ImplicitField]: InitialImplicitFields<Identifier>[ImplicitField];
};

/**
 * @returns union of explicit and implicit model fields
 */
type InjectDefaultFieldsForModel<FlatModel, ModelIdentifier> = FlatModel &
  ImplicitFields<
    FlatModel,
    'identifier' extends keyof ModelIdentifier
      ? ModelIdentifier['identifier']
      : never
  >;

/**
 * Mapped type that injects default implicit fields for a model
 * 1. Add "id" field to models with neither an explicit field named "id" nor a custom identifier (`.identifier(['some-field'])`)
 * 2. Add default timestamp fields ("createdAt", "updatedAt") unless they're already explicitly defined
 *
 * @typeParam FlattenedSchema - resolved schema type (TODO: add detail/example/link to type)
 */
export type InjectImplicitModelFields<FlattenedSchema, IdentifierMeta> = {
  [ModelName in keyof FlattenedSchema]: InjectDefaultFieldsForModel<
    FlattenedSchema[ModelName],
    ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : object
  >;
};
