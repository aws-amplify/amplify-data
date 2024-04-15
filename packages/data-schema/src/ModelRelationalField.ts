import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './util';
import { Authorization } from './Authorization';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export const __auth = Symbol('__auth');

const brandName = 'modelRelationalField';

export enum ModelRelationshipTypes {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  belongsTo = 'belongsTo',
  manyToMany = 'manyToMany', // TODO: remove this once type work is complete
}

type RelationshipTypes = `${ModelRelationshipTypes}`;

type ModelRelationalFieldData = {
  fieldType: 'model';
  type: ModelRelationshipTypes;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  arrayRequired: boolean;
  relationName?: string;
  references: string[];
  authorization: Authorization<any, any, any>[];
};

export type ModelRelationalFieldParamShape = {
  type: 'model';
  relationshipType: string;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  references: string[];
  arrayRequired: boolean;
  relationName?: string;
};

type ModelRelationalFieldFunctions<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof ModelRelationalField<T, RM> = never,
> = {
  /**
   * When set, it requires the value of the relationship type to be required.
   */
  valueRequired(): ModelRelationalField<
    SetTypeSubArg<T, 'valueRequired', true>,
    K | 'valueRequired'
  >;
  /**
   * When set, it requires the relationship to always return a value
   */
  required(): ModelRelationalField<
    // The RM generic cannot be "required" since no such field exists
    SetTypeSubArg<T, 'arrayRequired', true>,
    K | 'required'
  >;
  /**
   * When set, it requires the relationship to always return an array value
   * @deprecated this modifier should not be used and will be removed
   * in the next minor version of this package.
   */
  arrayRequired(): ModelRelationalField<
    SetTypeSubArg<T, 'arrayRequired', true>,
    K | 'arrayRequired'
  >;
  /**
   * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
   * multiple authorization rules for this field.
   */
  authorization<AuthRuleType extends Authorization<any, any, any>>(
    rules: AuthRuleType[],
  ): ModelRelationalField<T, K | 'authorization', K, AuthRuleType>;
};

export type ModelRelationalField<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof ModelRelationalField<T, RM> = never,
  Auth = undefined,
> = Omit<ModelRelationalFieldFunctions<T, RM, K>, K> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
} & Brand<typeof brandName>;

/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRelationalField = ModelRelationalField<
  ModelRelationalFieldParamShape,
  string,
  never
> & {
  data: ModelRelationalFieldData;
};

const relationalModifiers = [
  'required',
  'arrayRequired',
  'valueRequired',
  'authorization',
] as const;

const relationModifierMap: Record<
  `${ModelRelationshipTypes}`,
  (typeof relationalModifiers)[number][]
> = {
  belongsTo: ['authorization'],
  hasMany: ['arrayRequired', 'valueRequired', 'authorization'],
  hasOne: ['required', 'authorization'],
  manyToMany: ['arrayRequired', 'valueRequired', 'authorization'],
};

export type RelationTypeFunctionOmitMapping<
  Type extends ModelRelationshipTypes,
> = Type extends ModelRelationshipTypes.belongsTo
  ? 'required' | 'arrayRequired' | 'valueRequired'
  : Type extends ModelRelationshipTypes.hasMany
    ? 'required'
    : Type extends ModelRelationshipTypes.hasOne
      ? 'arrayRequired' | 'valueRequired'
      : never;

function _modelRelationalField<
  T extends ModelRelationalFieldParamShape,
  RelatedModel extends string,
  RT extends ModelRelationshipTypes,
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
    arrayRequired() {
      data.arrayRequired = true;

      return this;
    },
    valueRequired() {
      data.valueRequired = true;

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
  } as ModelRelationalField<T, RelatedModel>;

  const builder = Object.fromEntries(
    relationModifierMap[type].map((key) => [
      key,
      relationshipBuilderFunctions[key],
    ]),
  );

  return {
    ...builder,
    data,
  } as InternalRelationalField as ModelRelationalField<
    T,
    RelatedModel,
    RelationTypeFunctionOmitMapping<typeof type>
  >;
}

export type ModelRelationalTypeArgFactory<
  RM extends string,
  RT extends RelationshipTypes,
  IsArray extends boolean,
  RelationName extends string | undefined = undefined,
> = {
  type: 'model';
  relatedModel: RM;
  relationshipType: RT;
  array: IsArray;
  valueRequired: false;
  arrayRequired: false;
  relationName: RelationName;
  references: string[];
};

/**
 * Create a one-directional one-to-one relationship between two models using the `hasOne("MODEL_NAME")` method.
 * A hasOne relationship always uses a reference to the related model's identifier. Typically this is the `id` field
 * unless overwritten with the `identifier()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-one relationship definition
 */
export function hasOne<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasOne, false>,
    RM,
    ModelRelationshipTypes.hasOne
  >(
    ModelRelationshipTypes.hasOne,
    relatedModel,
    Array.isArray(references) ? references : [references]
  )
}

/**
 * Create a one-directional one-to-many relationship between two models using the `hasMany()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-many relationship definition
 */
export function hasMany<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasMany, true>,
    RM,
    ModelRelationshipTypes.hasMany
  >(
    ModelRelationshipTypes.hasMany,
    relatedModel,
    Array.isArray(references) ? references : [references],
  )
}

/**
 * Make a `hasOne()` or `hasMany()` relationship bi-directional using the `belongsTo()` method.
 * The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from
 * parent to the related model.
 * @param relatedModel name of the related `.hasOne()` or `.hasMany()` model
 * @returns a belong-to relationship definition
 */
export function belongsTo<RM extends string>(
  relatedModel: RM,
  references: string | string[],
) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false>,
    RM,
    ModelRelationshipTypes.belongsTo
  >(
    ModelRelationshipTypes.belongsTo,
    relatedModel,
    Array.isArray(references) ? references : [references]
  )
}
