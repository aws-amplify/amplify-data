import type { DerivedApiDefinition } from '@aws-amplify/amplify-api-next-types-alpha';
import type {
  ModelType,
  ModelTypeParamShape,
  InternalModel,
} from './ModelType';
export { __auth } from './ModelField';
import { defineData } from './SchemaProcessor';
import { CustomType, CustomTypeParamShape, InternalCustom } from './CustomType';

/*
 * Notes:
 *
 * TSC output diagnostics to benchmark
 */
type ModelSchemaModels = Record<string, ModelType<ModelTypeParamShape, any>>;
type ModelSchemaCustom = Record<string, CustomType<CustomTypeParamShape, any>>;
type InternalSchemaModels = Record<string, InternalModel>;
type InternalSchemaCustom = Record<string, InternalCustom>;

export type ModelSchemaParamShape = {
  models: ModelSchemaModels;
  custom?: ModelSchemaCustom;
};

type ModelSchemaData = {
  models: ModelSchemaModels;
  custom?: ModelSchemaCustom;
};

export type InternalSchema = {
  data: {
    models: InternalSchemaModels;
    custom?: InternalSchemaCustom;
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

function _schema<T extends ModelSchemaParamShape>(models: T['models'], custom?: T['custom']) {
  const data: ModelSchemaData = { models, custom };

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = { data } as InternalSchema;

    return defineData({ schema: internalSchema });
  };

  return { data, transform } as ModelSchema<T>;
}

export function schema<
  Models extends ModelSchemaModels,
  Custom extends ModelSchemaCustom,
>(
  models: Models,
  custom?: Custom,
): ModelSchema<{ models: Models, custom: Custom }> {
  return _schema(models, custom);
}
