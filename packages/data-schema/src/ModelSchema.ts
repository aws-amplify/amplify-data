import type {
  DerivedApiDefinition,
  SetTypeSubArg,
} from '@aws-amplify/data-schema-types';
import {
  type ModelType,
  type ModelTypeParamShape,
  type InternalModel,
  isSchemaModelType,
  SchemaModelType,
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

type SchemaContent =
  | ModelType<ModelTypeParamShape, any>
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
  models: {
    [TypeKey in keyof T['types']]: T['types'][TypeKey] extends ModelType<ModelTypeParamShape>
      ? SchemaModelType<T['types'][TypeKey]>
      : never;
  };
  transform: () => DerivedApiDefinition;
};

/**
 * Amplify API Next Model Schema shape
 */
export type ModelSchemaType = ModelSchema<ModelSchemaParamShape>;

/**
 * Filter the schema types down to only include the ModelTypes as SchemaModelType
 *
 * @param schemaContents The object containing all SchemaContent for this schema
 * @returns Only the schemaContents that are ModelTypes, coerced to the SchemaModelType surface
 */
const filterSchemaModelTypes = (
  schemaContents: ModelSchemaContents,
): Record<string, SchemaModelType> => {
  const modelTypes: Record<string, SchemaModelType> = {};

  if (schemaContents) {
    Object.entries(schemaContents).forEach(([key, content]) => {
      if (isSchemaModelType(content)) {
        modelTypes[key] = content;
      }
    });
  }

  return modelTypes;
};

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

  const models = filterSchemaModelTypes(data.types);

  const transform = (): DerivedApiDefinition => {
    const internalSchema: InternalSchema = { data } as InternalSchema;

    return processSchema({ schema: internalSchema });
  };

  const authorization = (rules: any): any => {
    data.authorization = rules;
    return { data, transform, models } as any;
  };

  return {
    data,
    transform,
    authorization,
    models,
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
