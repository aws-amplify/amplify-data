import type { DerivedApiDefinition } from '@aws-amplify/amplify-api-next-types-alpha';
import type {
  ModelType,
  ModelTypeParamShape,
  InternalModel,
} from './ModelType';
export { __auth } from './ModelField';
import { processSchema } from './SchemaProcessor';

/*
 * Notes:
 *
 * TSC output diagnostics to benchmark
 */

type ModelSchemaModels = Record<string, ModelType<ModelTypeParamShape, any>>;
type InternalSchemaModels = Record<string, InternalModel>;

export type ModelSchemaParamShape = {
  models: ModelSchemaModels;
};

type ModelSchemaData = {
  models: ModelSchemaModels;
};

export type InternalSchema = {
  data: {
    models: InternalSchemaModels;
  };
};

export type ModelSchema<T extends ModelSchemaParamShape> = {
  data: T;
  transform: () => DerivedApiDefinition;
};

/**
 * Amplify API Next Model Schema shape
 */
export type ModelSchemaType = ModelSchema<ModelSchemaParamShape>;

/**
 * Model Schema type guard
 * @param schema - api-next ModelSchema or string
 * @returns true if the given value is a ModelSchema
 */
export const isModelSchema = (
  schema: string | ModelSchemaType,
): schema is ModelSchemaType => {
  return typeof schema === 'object' && schema.data !== undefined;
};

function _schema<T extends ModelSchemaParamShape>(models: T['models']) {
  const data: ModelSchemaData = { models };

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = { data } as InternalSchema;

    return processSchema({ schema: internalSchema });
  };

  return { data, transform } as ModelSchema<T>;
}

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param models The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export function schema<Models extends ModelSchemaModels>(
  models: Models,
): ModelSchema<{ models: Models }> {
  return _schema(models);
}
