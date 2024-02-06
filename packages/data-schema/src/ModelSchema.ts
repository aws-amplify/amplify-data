import type {
  DerivedApiDefinition,
  SetTypeSubArg,
} from '@aws-amplify/data-schema-types';
import type {
  ModelType,
  ModelTypeParamShape,
  InternalModel,
} from './ModelType';
import type { EnumType, EnumTypeParamShape } from './EnumType';
import type { CustomType, CustomTypeParamShape } from './CustomType';
import type {
  CustomOperation,
  CustomOperationParamShape,
  InternalCustom,
} from './CustomOperation';
export { __auth } from './ModelField';
import { processSchema } from './SchemaProcessor';
import { Authorization } from './Authorization';

/*
 * Notes:
 *
 * TSC output diagnostics to benchmark
 */

type SchemaContent =
  | ModelType<ModelTypeParamShape, any, any>
  | CustomType<CustomTypeParamShape>
  | EnumType<EnumTypeParamShape>
  | CustomOperation<CustomOperationParamShape, any>;

type ModelSchemaContents = Record<string, SchemaContent>;
type InternalSchemaModels = Record<
  string,
  InternalModel | EnumType<any> | CustomType<any> | InternalCustom
>;

export type ModelSchemaParamShape = {
  types: ModelSchemaContents;
  authorization: Authorization<any, any, any>[];
};

type ModelSchemaData = {
  types: ModelSchemaContents;
  authorization: Authorization<any, any, any>[];
};

export type InternalSchema = {
  data: {
    types: InternalSchemaModels;
    authorization: Authorization<any, any, any>[];
  };
};

export type ModelSchema<
  T extends ModelSchemaParamShape,
  UsedMethods extends 'authorization' = never,
> = Omit<
  {
    authorization: <AuthRules extends Authorization<any, any, any>>(
      auth: AuthRules[],
    ) => ModelSchema<
      SetTypeSubArg<T, 'authorization', AuthRules[]>,
      UsedMethods | 'authorization'
    >;
  },
  UsedMethods
> & {
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
  const data: ModelSchemaData = { types, authorization: [] };

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = { data } as InternalSchema;

    return processSchema({ schema: internalSchema });
  };

  const authorization = (rules: any): any => {
    data.authorization = rules;
    return { data, transform } as any;
  };

  return {
    data,
    transform,
    authorization,
  } as ModelSchema<T>;
}

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export function schema<Types extends ModelSchemaContents>(
  types: Types,
): ModelSchema<{ types: Types; authorization: [] }> {
  return _schema(types);
}
