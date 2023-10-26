import { SetTypeSubArg } from '@aws-amplify/amplify-api-next-types-alpha';
import { Authorization } from './Authorization';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export const __auth = Symbol('__auth');

export enum ModelRelationshipTypes {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  belongsTo = 'belongsTo',
  manyToMany = 'manyToMany',
}

type RelationshipTypes = `${ModelRelationshipTypes}`;

const arrayTypeRelationships = ['hasMany', 'manyToMany'];

type ModelRelationalFieldData = {
  fieldType: 'model';
  type: ModelRelationshipTypes;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  arrayRequired: boolean;
  relationName?: string;
  authorization: Authorization<any, any>[];
};

export type ModelRelationalFieldParamShape = {
  type: 'model';
  relationshipType: string;
  relatedModel: string;
  array: boolean;
  valueRequired: boolean;
  arrayRequired: boolean;
  relationName?: string;
};

export type ModelRelationalField<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof ModelRelationalField<T, RM> = never,
  Auth = undefined,
> = Omit<
  {
    /**
     * When set, it requires the value of the relationship type to be required.
     */
    valueRequired(): ModelRelationalField<
      SetTypeSubArg<T, 'valueRequired', true>,
      K | 'valueRequired'
    >;
    /**
     * When set, it requires the relationship to always return an array value
     */
    arrayRequired(): ModelRelationalField<
      SetTypeSubArg<T, 'arrayRequired', true>,
      K | 'arrayRequired'
    >;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.  
     */
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[],
    ): ModelRelationalField<T, K | 'authorization', K, AuthRuleType>;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
};

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

function _modelRelationalField<
  T extends ModelRelationalFieldParamShape,
  RelatedModel extends string,
  RT extends ModelRelationshipTypes,
>(type: RT, relatedModel: RelatedModel, relationName?: string) {
  const data: ModelRelationalFieldData = {
    relatedModel,
    type,
    fieldType: 'model',
    array: false,
    valueRequired: false,
    arrayRequired: false,
    relationName,
    authorization: [],
  };

  if (arrayTypeRelationships.includes(type)) {
    data.array = true;
  }

  const builder: ModelRelationalField<T, RelatedModel> = {
    valueRequired() {
      data.valueRequired = true;

      return this;
    },
    arrayRequired() {
      data.arrayRequired = true;

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
  };

  return {
    ...builder,
    data,
  } as InternalRelationalField as ModelRelationalField<T, RelatedModel>;
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
};

/**
 * Create a one-directional one-to-one relationship between two models using the `hasOne("MODEL_NAME")` method.
 * A hasOne relationship always uses a reference to the related model's identifier. Typically this is the `id` field
 * unless overwritten with the `identifier()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-one relationship definition
 */
export function hasOne<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasOne, false>,
    RM,
    ModelRelationshipTypes.hasOne
  >(ModelRelationshipTypes.hasOne, relatedModel);
}

/**
 * Create a one-directional one-to-many relationship between two models using the `hasMany()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-many relationship definition
 */
export function hasMany<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasMany, true>,
    RM,
    ModelRelationshipTypes.hasMany
  >(ModelRelationshipTypes.hasMany, relatedModel);
}

/**
 * Make a `hasOne()` or `hasMany()` relationship bi-directional using the `belongsTo()` method. 
 * The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from 
 * parent to the related model.
 * @param relatedModel name of the related `.hasOne()` or `.hasMany()` model
 * @returns a belong-to relationship definition
 */
export function belongsTo<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false>,
    RM,
    ModelRelationshipTypes.belongsTo
  >(ModelRelationshipTypes.belongsTo, relatedModel);
}

/**
 * Create a many-to-many relationship between two models with the manyToMany() method.
 * Provide a common relationName on both models to join them into a many-to-many relationship.
 * Under the hood a many-to-many relationship is modeled with a "join table" with corresponding
 * `hasMany()` relationships between the two related models. You must set the same `manyToMany()`
 * field on both models of the relationship.
 * @param relatedModel name of the related model 
 * @param opts pass in the `relationName` that will serve as the join table name for this many-to-many relationship 
 * @returns a many-to-many relationship definition
 */
export function manyToMany<RM extends string, RN extends string>(
  relatedModel: RM,
  opts: { relationName: RN },
) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<
      RM,
      ModelRelationshipTypes.manyToMany,
      true,
      RN
    >,
    RM,
    ModelRelationshipTypes.manyToMany
  >(ModelRelationshipTypes.manyToMany, relatedModel, opts.relationName);
}
