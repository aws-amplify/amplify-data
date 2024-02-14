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

export type DatabaseType = 'SQL' | 'DynamoDB';

export type SchemaConfig<DBT extends DatabaseType = DatabaseType> = {
  databaseType: DBT;
};

export type ModelSchemaParamShape = {
  types: ModelSchemaContents;
  authorization: Authorization<any, any, any>[];
};

export type SQLModelSchemaParamShape = ModelSchemaParamShape & {
  setSqlStatementFolderPath?: string;
};

export type InternalSchema = {
  data: {
    types: InternalSchemaModels;
    authorization: Authorization<any, any, any>[];
  };
};

export type ModelSchema<
  T extends ModelSchemaParamShape,
  UsedMethods extends 'authorization' | 'setSqlStatementFolderPath' = never,
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

export type SqlModelSchema<
  T extends SQLModelSchemaParamShape,
  UsedMethods extends 'authorization' | 'setSqlStatementFolderPath' = never,
> = ModelSchema<T, UsedMethods> &
  Omit<
    {
      setSqlStatementFolderPath: (
        path: string,
      ) => ModelSchema<T, UsedMethods | 'setSqlStatementFolderPath'>;
    },
    UsedMethods
  >;

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

function _sqlSchemaExtension<T extends SQLModelSchemaParamShape>(
  schema: ModelSchema<T>,
): SqlModelSchema<T> {
  return {
    ...schema,
    setSqlStatementFolderPath(path: string): any {
      this.data.setSqlStatementFolderPath = path;
      const { setSqlStatementFolderPath: _, ...rest } = this;
      return rest;
    },
  };
}

function _baseSchema<T extends ModelSchemaParamShape>(types: T['types']) {
  const data: ModelSchemaParamShape = { types, authorization: [] };

  return {
    data,
    transform(): DerivedApiDefinition {
      const internalSchema: InternalSchema = { data } as InternalSchema;

      return processSchema({ schema: internalSchema });
    },
    authorization(rules: any): any {
      this.data.authorization = rules;
      const { authorization: _, ...rest } = this;
      return rest;
    },
    models: filterSchemaModelTypes(data.types),
  } as ModelSchema<T>;
}

type SchemaReturnType<DBT extends DatabaseType> = DBT extends 'SQL'
  ? SqlModelSchema<ModelSchemaParamShape>
  : DBT extends 'DynamoDB'
    ? ModelSchema<ModelSchemaParamShape>
    : never;

function bindConfigToSchema<DBT extends DatabaseType>(config: {
  databaseType: DBT;
}): <Types extends ModelSchemaContents>(types: Types) => SchemaReturnType<DBT> {
  return (types) =>
    (config.databaseType === 'SQL'
      ? _sqlSchemaExtension(_baseSchema(types))
      : _baseSchema(types)) as SchemaReturnType<DBT>;
}

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export const schema = bindConfigToSchema({ databaseType: 'DynamoDB' });

/**
 * Configure wraps schema definition with non-default config to allow usecases other than
 * the default DynamoDB use-case.
 *
 * @param config The SchemaConfig augments the schema with content like the database type
 * @returns
 */

export function configure<DBT extends DatabaseType>(config: {
  databaseType: DBT;
}): {
  schema: <Types extends ModelSchemaContents>(
    types: Types,
  ) => SchemaReturnType<DBT>;
} {
  return {
    schema: bindConfigToSchema(config),
  };
}
