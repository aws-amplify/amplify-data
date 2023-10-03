import type {Prettify, ModelSchemaType, ModelSchemaParamShape, ModelSchema, InternalSchema} from '@aws-amplify/amplify-api-next-types-alpha';

/*
 * Notes:
 *
 * TSC output diagnostics to benchmark
 */


/**
 * Model Schema type guard
 * @param schema - api-next ModelSchema or string
 * @returns true if the given value is a ModelSchema
 */
export const isModelSchema = (
  schema: string | ModelSchemaType
): schema is ModelSchemaType => {
  return typeof schema === 'object' && schema.data !== undefined;
};

function _schema<T extends ModelSchemaParamShape>(models: T['models']) {
  const data: ModelSchemaParamShape["models"] = { models };

  return { data } as Prettify<InternalSchema> as ModelSchema<T>;
}

export function schema<Models extends ModelSchemaParamShape["models"]>(
  models: Models
): ModelSchema<{ models: Models }> {
  return _schema(models);
}
