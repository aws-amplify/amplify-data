import type { DerivedApiDefinition } from '@aws-amplify/data-schema-types';
import type {
  ModelType,
  ModelTypeParamShape,
  InternalModel,
} from './ModelType';
import type { EnumType } from './EnumType';
import type { CustomType } from './CustomType';
export { __auth } from './ModelField';
import { processSchema } from './SchemaProcessor';

/*
 * Notes:
 *
 * TSC output diagnostics to benchmark
 */

type ModelSchemaModels = Record<string, ModelType<ModelTypeParamShape, any>>;
type InternalSchemaModels = Record<
  string,
  InternalModel | EnumType<any> | CustomType<any>
>;

export type ModelSchemaParamShape = {
  types: ModelSchemaModels;
};

type ModelSchemaData = {
  types: ModelSchemaModels;
};

export type InternalSchema = {
  data: {
    types: InternalSchemaModels;
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

function _schema<T extends ModelSchemaParamShape>(types: T['types']) {
  const data: ModelSchemaData = { types };

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = { data } as InternalSchema;

    return processSchema({ schema: internalSchema });
  };

  return { data, transform } as ModelSchema<T>;
}

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export function schema<Types extends ModelSchemaModels>(
  types: Types,
): ModelSchema<{ types: Types }> {
  return _schema(types);
}
