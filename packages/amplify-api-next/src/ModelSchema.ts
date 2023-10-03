import type {ModelSchemaType, ModelSchemaParamShape, ModelSchema, InternalSchema, DerivedApiDefinition} from '@aws-amplify/amplify-api-next-types-alpha';
import { defineData } from './SchemaProcessor';

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

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = {data} as InternalSchema;

    return defineData({schema: internalSchema})
  }

  return { data, transform } as ModelSchema<T>;
}

export function schema<Models extends ModelSchemaParamShape["models"]>(
  models: Models
): ModelSchema<{ models: Models }> {
  return _schema(models);
}
