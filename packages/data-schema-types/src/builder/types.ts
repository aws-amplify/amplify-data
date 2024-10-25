/**
 * references IAmplifyGraphqlDefinition from:
 * https://github.com/aws-amplify/amplify-category-api/blob/4c0ea253a0bae51f775383929ba4748593185bc1/packages/amplify-graphql-api-construct/src/types.ts#L491-L503
 *
 * function slots is any'd for now. Will add actual type when we add support for this feature
 */

export interface DerivedApiDefinition {
  /**
   * Return the schema definition as a graphql string, with amplify directives allowed.
   * @returns the rendered schema.
   */
  readonly schema: string;

  /**
   * Retrieve any function slots defined explicitly in the Api definition.
   * @returns generated function slots
   */
  readonly functionSlots: any[];
  readonly jsFunctions: JsResolver[];
  readonly lambdaFunctions: LambdaFunctionDefinition;
  readonly functionSchemaAccess: FunctionSchemaAccess[];
  readonly customSqlDataSourceStrategies?: CustomSqlDataSourceStrategy[];
}

export type DerivedCombinedSchema = {
  schemas: DerivedModelSchema[];
};

export type DerivedModelSchema = {
  data: {
    types: object;
    configuration: SchemaConfiguration;
  };

  transform: () => DerivedApiDefinition;
};

type PathEntry = { relativePath: string; importLine: string };

export type JsResolverEntry = string | PathEntry;

export type SqlStatementFolderEntry = PathEntry;

export type JsResolver = {
  typeName: 'Mutation' | 'Query' | 'Subscription';
  fieldName: string;
  handlers: {
    dataSource: string;
    entry: JsResolverEntry;
  }[];
};

export type LambdaFunctionDefinition = Record<string, DefineFunction>;

export type FunctionSchemaAccess = {
  resourceProvider: DefineFunction;
  actions: ('query' | 'mutate' | 'listen')[];
};

export type DefineFunction = {
  readonly provides?: string | undefined;
  getInstance: (props: any) => any;
};

export type DatasourceEngine = 'mysql' | 'postgresql' | 'dynamodb';

export type CustomSqlDataSourceStrategy = {
  typeName: 'Query' | 'Mutation';
  fieldName: string;
  entry?: JsResolverEntry;
};

type SubnetAZ = {
  subnetId: string;
  availabilityZone: string;
};

type VpcConfig = {
  vpcId: string;
  securityGroupIds: string[];
  subnetAvailabilityZones: SubnetAZ[];
};

export type DataSourceConfiguration<
  DE extends DatasourceEngine = DatasourceEngine,
> = DE extends 'dynamodb'
  ? { engine: DE }
  : {
      engine: DE;
      connectionUri: BackendSecret;
      vpcConfig?: VpcConfig;
      identifier?: string;
      sslCert?: BackendSecret;
    };

export type SchemaConfiguration<
  DE extends DatasourceEngine = DatasourceEngine,
  DC extends DataSourceConfiguration<DE> = DataSourceConfiguration<DE>,
> = {
  database: DC;
};

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

/**
 * @experimental
 */
export type AiModel = {
  resourcePath: string;
}
