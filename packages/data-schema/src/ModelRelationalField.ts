import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './util';
import { AllowModifier, _Internal_Authorization, allow } from './Authorization';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export const __auth = Symbol('__auth');

const brandName = 'modelRelationalField';

/**
 * # INTERNAL
 *
 * Not intended to be consumed directly, as naming and factoring
 * is subject to change.
 */
export enum _Internal_ModelRelationshipTypes {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  belongsTo = 'belongsTo',
}

type RelationshipTypes = `${_Internal_ModelRelationshipTypes}`;

type ModelRelationalFieldData = {
  fieldType: 'model';
  type: _Internal_ModelRelationshipTypes;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  arrayRequired: boolean;
  references: string[];
  authorization: _Internal_Authorization<any, any, any>[];
};

export type ModelRelationalFieldParamShape = {
  type: 'model';
  relationshipType: string;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  references: string[];
  arrayRequired: boolean;
};

type ModelRelationalFieldFunctions<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof _Internal_ModelRelationalField<T, RM> = never,
> = {
  /**
   * When set, it requires the value of the relationship type to be required.
   */
  valueRequired(): _Internal_ModelRelationalField<
    SetTypeSubArg<T, 'valueRequired', true>,
    K | 'valueRequired'
  >;
  /**
   * When set, it requires the relationship to always return a value
   */
  required(): _Internal_ModelRelationalField<
    // The RM generic cannot be "required" since no such field exists
    SetTypeSubArg<T, 'arrayRequired', true>,
    K | 'required'
  >;
  /**
   * Configures field-level authorization rules. Pass in an array of authorizations `(allow => allow.____)` to mix and match
   * multiple authorization rules for this field.
   */
  authorization<AuthRuleType extends _Internal_Authorization<any, any, any>>(
    callback: (allow: AllowModifier) => AuthRuleType | AuthRuleType[],
  ): _Internal_ModelRelationalField<T, K | 'authorization', K, AuthRuleType>;
};

/**
 * # INTERNAL
 *
 * Not intended to be consumed directly, as naming and factoring
 * is subject to change.
 */
export type _Internal_ModelRelationalField<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof _Internal_ModelRelationalField<T, RM> = never,
  Auth = undefined,
> = Omit<ModelRelationalFieldFunctions<T, RM, K>, K> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
} & Brand<typeof brandName>;

/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRelationalField = _Internal_ModelRelationalField<
  ModelRelationalFieldParamShape,
  string,
  never
> & {
  data: ModelRelationalFieldData;
};

const relationalModifiers = [
  'required',
  'valueRequired',
  'authorization',
] as const;

const relationModifierMap: Record<
  `${_Internal_ModelRelationshipTypes}`,
  (typeof relationalModifiers)[number][]
> = {
  belongsTo: ['authorization'],
  hasMany: ['valueRequired', 'authorization'],
  hasOne: ['required', 'authorization'],
};

export type RelationTypeFunctionOmitMapping<
  Type extends _Internal_ModelRelationshipTypes,
> = Type extends _Internal_ModelRelationshipTypes.belongsTo
  ? 'required' | 'valueRequired'
  : Type extends _Internal_ModelRelationshipTypes.hasMany
    ? 'required'
    : Type extends _Internal_ModelRelationshipTypes.hasOne
      ? 'valueRequired'
      : never;

function _modelRelationalField<
  T extends ModelRelationalFieldParamShape,
  RelatedModel extends string,
  RT extends _Internal_ModelRelationshipTypes,
>(type: RT, relatedModel: RelatedModel, references: string[]) {
  const data: ModelRelationalFieldData = {
    relatedModel,
    type,
    fieldType: 'model',
    array: false,
    valueRequired: false,
    arrayRequired: false,
    references,
    authorization: [],
  };

  data.array = type === 'hasMany';
  const relationshipBuilderFunctions = {
    required() {
      data.arrayRequired = true;

      return this;
    },
    valueRequired() {
      data.valueRequired = true;

      return this;
    },
    authorization(callback) {
      const rules = callback(allow);
      data.authorization = Array.isArray(rules) ? rules : [rules];

      return this;
    },
  } as _Internal_ModelRelationalField<T, RelatedModel>;

  const builder = Object.fromEntries(
    relationModifierMap[type].map((key) => [
      key,
      relationshipBuilderFunctions[key],
    ]),
  );

  return {
    ...builder,
    data,
  } as InternalRelationalField as _Internal_ModelRelationalField<
    T,
    RelatedModel,
    RelationTypeFunctionOmitMapping<typeof type>
  >;
}

/**
 * # INTERNAL
 *
 * Not intended to be consumed directly, as naming and factoring
 * is subject to change.
 */
export type _Internal_ModelRelationalTypeArgFactory<
  RM extends string,
  RT extends RelationshipTypes,
  IsArray extends boolean,
> = {
  type: 'model';
  relatedModel: RM;
  relationshipType: RT;
  array: IsArray;
  valueRequired: false;
  arrayRequired: false;
  references: string[];
};

/**
 * Create one-to-one relationship between two models using the `hasOne("MODEL_NAME", "REFERENCE_FIELD(s)")` method.
 * A hasOne relationship always uses a reference to the related model's identifier. Typically this is the `id` field
 * unless overwritten with the `identifier()` method.
 * @example
 * const schema = a.schema({
 *   Cart: a.model({
 *     items: a.string().required().array(),
 *     // 1. Create reference field
 *     customerId: a.id(),
 *     // 2. Create relationship field with the reference field
 *     customer: a.belongsTo('Customer', 'customerId'),
 *   }),
 *   Customer: a.model({
 *     name: a.string(),
 *     // 3. Create relationship field with the reference field
 *     //    from the Cart model
 *     activeCart: a.hasOne('Cart', 'customerId')
 *   }),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-a-one-to-one-relationship}
 * @param relatedModel the name of the related model
 * @param references the field(s) that should be used to reference the related model
 * @returns a one-to-one relationship definition
 */
export function hasOne<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    _Internal_ModelRelationalTypeArgFactory<
      RM,
      _Internal_ModelRelationshipTypes.hasOne,
      false
    >,
    RM,
    _Internal_ModelRelationshipTypes.hasOne
  >(
    _Internal_ModelRelationshipTypes.hasOne,
    relatedModel,
    Array.isArray(references) ? references : [references],
  );
}

/**
 * Create a one-directional one-to-many relationship between two models using the `hasMany("MODEL_NAME", "REFERENCE_FIELD(s)")` method.
 * @example
 * const schema = a.schema({
 *   Member: a.model({
 *     name: a.string().required(),
 *     // 1. Create a reference field
 *     teamId: a.id(),
 *     // 2. Create a belongsTo relationship with the reference field
 *     team: a.belongsTo('Team', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 *
 *   Team: a.model({
 *     mantra: a.string().required(),
 *     // 3. Create a hasMany relationship with the reference field
 *     //    from the `Member`s model.
 *     members: a.hasMany('Member', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-one-to-many-relationships}
 * @param relatedModel the name of the related model
 * @param references the field(s) that should be used to reference the related model
 * @returns a one-to-many relationship definition
 */
export function hasMany<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    _Internal_ModelRelationalTypeArgFactory<
      RM,
      _Internal_ModelRelationshipTypes.hasMany,
      true
    >,
    RM,
    _Internal_ModelRelationshipTypes.hasMany
  >(
    _Internal_ModelRelationshipTypes.hasMany,
    relatedModel,
    Array.isArray(references) ? references : [references],
  );
}

/**
 * Use `belongsTo()` to create a field to query the related `hasOne()` or `hasMany()` relationship.
 * The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from
 * parent to the related model.
 *
 * @example
 * // one-to-many relationship
 * const schema = a.schema({
 *   Member: a.model({
 *     name: a.string().required(),
 *     // 1. Create a reference field
 *     teamId: a.id(),
 *     // 2. Create a belongsTo relationship with the reference field
 *     team: a.belongsTo('Team', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 *
 *   Team: a.model({
 *     mantra: a.string().required(),
 *     // 3. Create a hasMany relationship with the reference field
 *     //    from the `Member`s model.
 *     members: a.hasMany('Member', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 * });
 * @example
 * // one-to-one relationship
 * const schema = a.schema({
 *   Cart: a.model({
 *     items: a.string().required().array(),
 *     // 1. Create reference field
 *     customerId: a.id(),
 *     // 2. Create relationship field with the reference field
 *     customer: a.belongsTo('Customer', 'customerId'),
 *   }),
 *   Customer: a.model({
 *     name: a.string(),
 *     // 3. Create relationship field with the reference field
 *     //    from the Cart model
 *     activeCart: a.hasOne('Cart', 'customerId')
 *   }),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/}
 * @param relatedModel name of the related `.hasOne()` or `.hasMany()` model
 * @param references the field(s) that should be used to reference the related model
 * @returns a belong-to relationship definition
 */
export function belongsTo<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    _Internal_ModelRelationalTypeArgFactory<
      RM,
      _Internal_ModelRelationshipTypes.belongsTo,
      false
    >,
    RM,
    _Internal_ModelRelationshipTypes.belongsTo
  >(
    _Internal_ModelRelationshipTypes.belongsTo,
    relatedModel,
    Array.isArray(references) ? references : [references],
  );
}
