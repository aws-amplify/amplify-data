import type {
  ModelType,
  ModelTypeParamShape,
  InternalModel,
} from './ModelType';
import {DerivedApiDefinition} from './types';


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

export type InternalSchema = {
  data: {
    models: InternalSchemaModels;
  };
};

export type ModelSchema<T extends ModelSchemaParamShape> = {
  data: T;
  transform: () => DerivedApiDefinition
};

/**
 * Amplify API Next Model Schema shape
 */
export type ModelSchemaType = ModelSchema<ModelSchemaParamShape>;
