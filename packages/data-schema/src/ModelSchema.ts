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
import { Authorization } from './Authorization';
import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Prettify } from '@aws-amplify/data-schema-types';

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
  authorization: Authorization<any, any, any>[];
};

type ModelSchemaData = {
  types: ModelSchemaModels;
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
      // T,
      // { types: T['types']; authorization: AuthRules[] },
      // UsedMethods | 'authorization'
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

  return { data, transform, authorization } as ModelSchema<T>;
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
): ModelSchema<{ types: Types; authorization: [] }> {
  return _schema(types);
}
