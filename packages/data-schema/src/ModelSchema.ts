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
  MutationCustomOperation,
  QueryCustomOperation,
  SubscriptionCustomOperation,
} from './CustomOperation';
import { processSchema } from './SchemaProcessor';
import { SchemaAuthorization } from './Authorization';

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

/**
 * Importing the full objects from @aws-amplify/plugin-types
 * more than doubles dev env runtime. This type replacement
 * will contain the content for config without the negative
 * side-effects. We may need to re-approach if customers interact
 * with these programmatically to avoid forcing narrowing.
 */
type BackendSecret = {
  resolve: (scope: any, backendIdentifier: any) => any;
  resolvePath: (backendIdentifier: any) => any;
};

export type DatasourceEngine = 'mysql' | 'postgresql' | 'dynamodb';

type DatasourceConfig<DE extends DatasourceEngine> = DE extends 'dynamodb'
  ? { engine: DE }
  : {
      engine: DE;
      hostname: BackendSecret;
      username: BackendSecret;
      password: BackendSecret;
      port: BackendSecret;
      databaseName: BackendSecret;
      // TODO: clarify type
      vpcConfig?: Record<string, never>;
    };

export type SchemaConfig<
  DE extends DatasourceEngine,
  DC extends DatasourceConfig<DE>,
> = {
  database: DC;
};

export type ModelSchemaParamShape = {
  types: ModelSchemaContents;
  authorization: SchemaAuthorization<any, any, any>[];
  configuration: SchemaConfig<any, any>;
};

export type SQLModelSchemaParamShape = ModelSchemaParamShape & {
  setSqlStatementFolderPath?: string;
};

export type InternalSchema = {
  data: {
    types: InternalSchemaModels;
    authorization: SchemaAuthorization<any, any, any>[];
    configuration: SchemaConfig<any, any>;
  };
};

export type ModelSchema<
  T extends ModelSchemaParamShape,
  UsedMethods extends 'authorization' = never,
> = Omit<
  {
    authorization: <AuthRules extends SchemaAuthorization<any, any, any>>(
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

type SQLModelSchemaFunctions =
  | 'setSqlStatementFolderPath'
  | 'addQueries'
  | 'addMutations'
  | 'addSubscriptions';

export type SQLModelSchema<
  T extends SQLModelSchemaParamShape,
  UsedMethods extends 'authorization' | SQLModelSchemaFunctions = never,
> = ModelSchema<T, Exclude<UsedMethods, SQLModelSchemaFunctions>> &
  Omit<
    {
      setSqlStatementFolderPath: (
        path: string,
      ) => SQLModelSchema<T, UsedMethods | 'setSqlStatementFolderPath'>;
      addQueries: (
        types: Record<string, QueryCustomOperation>,
      ) => SQLModelSchema<T, UsedMethods | 'addQueries'>;
      addMutations: (
        types: Record<string, MutationCustomOperation>,
      ) => SQLModelSchema<T, UsedMethods | 'addMutations'>;
      addSubscriptions: (
        types: Record<string, SubscriptionCustomOperation>,
      ) => SQLModelSchema<T, UsedMethods | 'addSubscriptions'>;
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
): SQLModelSchema<T> {
  return {
    ...schema,
    setSqlStatementFolderPath(path: string): any {
      this.data.setSqlStatementFolderPath = path;
      const { setSqlStatementFolderPath: _, ...rest } = this;
      return rest;
    },
    addQueries(types: Record<string, QueryCustomOperation>): any {
      this.data.types = { ...this.data.types, ...types };
      const { addQueries: _, ...rest } = this;
      return rest;
    },
    addMutations(types: Record<string, MutationCustomOperation>): any {
      this.data.types = { ...this.data.types, ...types };
      const { addMutations: _, ...rest } = this;
      return rest;
    },
    addSubscriptions(types: Record<string, SubscriptionCustomOperation>): any {
      this.data.types = { ...this.data.types, ...types };
      const { addSubscriptions: _, ...rest } = this;
      return rest;
    },
  };
}

function _baseSchema<
  T extends ModelSchemaParamShape,
  DSC extends SchemaConfig<any, any>,
>(types: T['types'], config: DSC) {
  const data: ModelSchemaParamShape = {
    types,
    authorization: [],
    configuration: config,
  };
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

type SchemaReturnType<
  DE extends DatasourceEngine,
  Types extends ModelSchemaContents,
> = DE extends 'dynamodb'
  ? ModelSchema<{ types: Types; authorization: []; configuration: any }>
  : SQLModelSchema<{ types: Types; authorization: []; configuration: any }>;

function bindConfigToSchema<DE extends DatasourceEngine>(
  config: SchemaConfig<DE, DatasourceConfig<DE>>,
): <Types extends ModelSchemaContents>(
  types: Types,
) => SchemaReturnType<DE, Types> {
  return (types) => {
    return (
      config.database.engine === 'dynamodb'
        ? _baseSchema(types, config)
        : _sqlSchemaExtension(_baseSchema(types, config))
    ) as SchemaReturnType<DE, any>;
  };
}

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export const schema = bindConfigToSchema({ database: { engine: 'dynamodb' } });

/**
 * Configure wraps schema definition with non-default config to allow usecases other than
 * the default DynamoDB use-case.
 *
 * @param config The SchemaConfig augments the schema with content like the database type
 * @returns
 */
export function configure<DE extends DatasourceEngine>(
  config: SchemaConfig<DE, DatasourceConfig<DE>>,
): {
  schema: <Types extends ModelSchemaContents>(
    types: Types,
  ) => SchemaReturnType<DE, Types>;
} {
  return {
    schema: bindConfigToSchema(config),
  };
}
