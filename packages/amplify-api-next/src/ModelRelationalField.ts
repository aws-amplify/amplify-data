import { ModelRelationshipTypes, ModelRelationalFieldParamShape, ModelRelationalField, InternalRelationalField, ModelRelationalTypeArgFactory, ModelRelationalFieldData } from '@aws-amplify/amplify-api-next-types-alpha';

const arrayTypeRelationships = ['hasMany', 'manyToMany'];

function _modelRelationalField<
  T extends ModelRelationalFieldParamShape,
  RelatedModel extends string,
  RT extends ModelRelationshipTypes
>(type: RT, relatedModel: RelatedModel, connectionName?: string) {
  const data: ModelRelationalFieldData = {
    relatedModel,
    type,
    fieldType: 'model',
    array: false,
    valueOptional: false,
    arrayOptional: false,
    connectionName,
    authorization: [],
  };

  if (arrayTypeRelationships.includes(type)) {
    data.array = true;
  }

  const builder: ModelRelationalField<T, RelatedModel> = {
    valueOptional() {
      data.valueOptional = true;

      return this;
    },
    arrayOptional() {
      data.arrayOptional = true;

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

export function hasOne<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasOne, false>,
    RM,
    ModelRelationshipTypes.hasOne
  >(ModelRelationshipTypes.hasOne, relatedModel);
}

export function hasMany<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasMany, true>,
    RM,
    ModelRelationshipTypes.hasMany
  >(ModelRelationshipTypes.hasMany, relatedModel);
}

export function belongsTo<RM extends string>(relatedModel: RM) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false>,
    RM,
    ModelRelationshipTypes.belongsTo
  >(ModelRelationshipTypes.belongsTo, relatedModel);
}

export function manyToMany<RM extends string, CN extends string>(
  relatedModel: RM,
  opts: { connectionName: CN }
) {
  return _modelRelationalField<
    ModelRelationalTypeArgFactory<
      RM,
      ModelRelationshipTypes.manyToMany,
      true,
      CN
    >,
    RM,
    ModelRelationshipTypes.manyToMany
  >(ModelRelationshipTypes.manyToMany, relatedModel, opts.connectionName);
}
