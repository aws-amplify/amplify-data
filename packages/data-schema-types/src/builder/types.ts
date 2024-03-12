import {
  ConstructFactory,
  FunctionResources,
  ResourceAccessAcceptorFactory,
  ResourceProvider,
} from '@aws-amplify/plugin-types';

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
}

export type DerivedModelSchema = {
  data: {
    types: object;
  };
  transform: () => DerivedApiDefinition;
};

export type JsResolverEntry =
  | string
  | { relativePath: string; importLine: string };

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

export type DefineFunction = ConstructFactory<
  ResourceProvider<FunctionResources> & ResourceAccessAcceptorFactory
>;
