import type { PrimaryIndexIrBuilderShape } from '../util';

type DefaultIdentifierFields = {
  // implicit `id` is readonly because it's managed by the resolver; explicit `id` is writable
  readonly id: string;
};

type DefaultIdentifierType = { pk: { id: string } };

type DefaultTimestampFields = {
  readonly createdAt: string;
  readonly updatedAt: string;
};

type InitialImplicitFields<Identifier> =
  Identifier extends DefaultIdentifierType
    ? DefaultIdentifierFields & DefaultTimestampFields
    : DefaultTimestampFields;

/**
 * @returns true if a string union `ExplicitFieldNames` contains a given string `FieldName`
 */
type FieldExists<ExplicitFieldNames extends string, FieldName extends string> =
  Extract<ExplicitFieldNames, FieldName> extends never ? false : true;

/**
 * @returns union of explicitly defined field names for a model
 */
type GetModelFieldNames<FlatModel> =
  FlatModel extends Record<infer R, any> ? R : never;

/**
 * Generate Record type containing all implicit fields for a given model
 */
type ImplicitFields<
  FlatModel,
  Identifier extends PrimaryIndexIrBuilderShape,
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
 * @returns intersection of explicit and implicit model fields
 */
type InjectDefaultFieldsForModel<
  FlatModel,
  ModelIdentifier extends { identifier: PrimaryIndexIrBuilderShape },
> = FlatModel &
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
export type InjectImplicitModelFields<
  FlattenedSchema,
  IdentifierMeta extends Record<
    string,
    { identifier: PrimaryIndexIrBuilderShape }
  >,
> = {
  [ModelName in keyof FlattenedSchema]: InjectDefaultFieldsForModel<
    FlattenedSchema[ModelName],
    ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : never
  >;
};
