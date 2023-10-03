import {ModelType, InternalModel, ModelTypeParamShape, ModelData } from '@aws-amplify/amplify-api-next-types-alpha';

/**
 * Internal representation of Model Type that exposes the `data` property.
 * Used at buildtime.
 */

function _model<T extends ModelTypeParamShape>(fields: T['fields']) {
  const data: ModelData = {
    fields,
    identifier: ['id'],
    authorization: [],
  };

  const builder: ModelType<T> = {
    identifier(identifier) {
      data.identifier = identifier;

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
  };

  return { ...builder, data } as InternalModel as ModelType<T>;
}

export function model<T extends ModelData["fields"]>(
  fields: T
): ModelType<{ fields: T; identifier: Array<'id'>; authorization: [] }> {
  return _model(fields);
}
