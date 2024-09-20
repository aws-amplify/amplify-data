// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AuthModeParams,
  AmplifyServer,
  BaseClient,
  BaseBrowserClient,
  BaseSSRClient,
  ClientInternalsGetter,
  CustomOperation,
  GraphQLOptions,
  GraphQLResult,
  GraphqlSubscriptionResult,
  INTERNAL_USER_AGENT_OVERRIDE,
  ListArgs,
  QueryArgs,
  ModelIntrospectionSchema,
  CustomOperationArgument,
  InputFieldType,
  EnumType,
  InputType,
  CustomUserAgentDetails,
} from '../../bridge-types';

import { map } from 'rxjs';

import {
  authModeParams,
  getDefaultSelectionSetForNonModelWithIR,
  generateSelectionSet,
  getCustomHeaders,
  initializeModel,
  selectionSetIRToString,
} from '../APIClient';

import { handleSingularGraphQlError } from './utils';
import { selfAwareAsync } from '../../utils';

import { extendCancellability } from '../cancellation';

type CustomOperationOptions = AuthModeParams & ListArgs;

type GraphQLOptionsWithOverride = GraphQLOptions & {
  [INTERNAL_USER_AGENT_OVERRIDE]?: CustomUserAgentDetails;
};

// these are the 4 possible sets of arguments custom operations methods can receive
type OpArgs =
  // SSR Request Client w Args defined
  | [AmplifyServer.ContextSpec, QueryArgs, CustomOperationOptions]
  // SSR Request Client without Args defined
  | [AmplifyServer.ContextSpec, CustomOperationOptions]
  // Client or SSR Cookies Client w Args defined
  | [QueryArgs, CustomOperationOptions]
  // Client or SSR Cookies Client without Args defined
  | [CustomOperationOptions];

/**
 * Type guard for checking whether a Custom Operation argument is a contextSpec object
 */
const argIsContextSpec = (
  arg: OpArgs[number],
): arg is AmplifyServer.ContextSpec => {
  return typeof (arg as AmplifyServer.ContextSpec)?.token?.value === 'symbol';
};

/**
 * Builds an operation function, embedded with all client and context data, that
 * can be attached to a client as a custom query or mutation.
 *
 * If we have this source schema:
 *
 * ```typescript
 * a.schema({
 *   echo: a.query()
 *     .arguments({input: a.string().required()})
 *     .returns(a.string())
 * })
 * ```
 *
 * Our model intro schema will contain an entry like this:
 *
 * ```ts
 * {
 *   queries: {
 *     echo: {
 *       name: "echo",
 *       isArray: false,
 *       type: 'String',
 *       isRequired: false,
 *       arguments: {
 *         input: {
 *           name: 'input',
 *           isArray: false,
 *           type: String,
 *           isRequired: true
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * The `echo` object is used to build the `echo' method that goes here:
 *
 * ```typescript
 * const client = generateClent()
 * const { data } = await client.queries.echo({input: 'a string'});
 * //                                    ^
 * //                                    |
 * //                                    +-- This one right here.
 * //
 * ```
 *
 *
 * @param client The client to run graphql queries through.
 * @param modelIntrospection The model introspection schema the op comes from.
 * @param operationType The broad category of graphql operation.
 * @param operation The operation definition from the introspection schema.
 * @param useContext Whether the function needs to accept an SSR context.
 * @returns The operation function to attach to query, mutations, etc.
 */
export function customOpFactory(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  operationType: 'query' | 'mutation' | 'subscription',
  operation: CustomOperation,
  useContext: boolean,
  getInternals: ClientInternalsGetter,
  customUserAgentDetails?: CustomUserAgentDetails,
) {
  // .arguments() are defined for the custom operation in the schema builder
  // and are present in the model introspection schema
  const argsDefined = operation.arguments !== undefined;

  const op = (...args: OpArgs) => {
    // options is always the last argument
    const options = args[args.length - 1] as CustomOperationOptions;

    const userAgentOverride = customUserAgentDetails
      ? { [INTERNAL_USER_AGENT_OVERRIDE]: customUserAgentDetails }
      : {};

    let contextSpec: AmplifyServer.ContextSpec | undefined;
    let arg: QueryArgs | undefined;

    if (useContext) {
      if (argIsContextSpec(args[0])) {
        contextSpec = args[0];
      } else {
        throw new Error(
          `Invalid first argument passed to ${operation.name}. Expected contextSpec`,
        );
      }
    }

    if (argsDefined) {
      if (useContext) {
        arg = args[1] as QueryArgs;
      } else {
        arg = args[0] as QueryArgs;
      }
    }

    if (operationType === 'subscription') {
      return _opSubscription(
        // subscriptions are only enabled on the clientside
        client as BaseBrowserClient,
        modelIntrospection,
        operation,
        getInternals,
        arg,
        { ...options, ...userAgentOverride },
      );
    }

    return _op(
      client,
      modelIntrospection,
      operationType,
      operation,
      getInternals,
      arg,
      { ...options, ...userAgentOverride },
      contextSpec,
    );
  };

  return op;
}

/**
 * Runtime test and type guard to check whether `o[field]` is a `String`.
 *
 * ```typescript
 * if (hasStringField(o, 'prop')) {
 *   const s = o.prop;
 *   //    ^? const s: string
 * }
 * ```
 *
 * @param o Object to inspect
 * @param field Field to look for
 * @returns Boolean: `true` if the `o[field]` is a `string`
 */
function hasStringField<Field extends string>(
  o: any,
  field: Field,
): o is Record<Field, string> {
  return typeof o[field] === 'string';
}

function isEnumType(type: InputFieldType): type is EnumType {
  return type instanceof Object && 'enum' in type;
}

function isInputType(type: InputFieldType): type is InputType {
  return type instanceof Object && 'input' in type;
}

/**
 * @param argDef A single argument definition from a custom operation
 * @returns A string naming the base type including the `!` if the arg is required.
 */
function argumentBaseTypeString({ type, isRequired }: CustomOperationArgument) {
  const requiredFlag = isRequired ? '!' : '';
  if (isEnumType(type)) {
    return `${type.enum}${requiredFlag}`;
  }
  if (isInputType(type)) {
    return `${type.input}${requiredFlag}`;
  }
  return `${type}${requiredFlag}`;
}

/**
 * Generates "outer" arguments string for a custom operation. For example,
 * in this operation:
 *
 * ```graphql
 * query MyQuery(InputString: String!) {
 *   echoString(InputString: $InputString)
 * }
 * ```
 *
 * This function returns the top/outer level arguments as a string:
 *
 * ```json
 * "InputString: String!"
 * ```
 *
 * @param operation Operation object from model introspection schema.
 * @returns "outer" arguments string
 */
function outerArguments(operation: CustomOperation): string {
  if (operation.arguments === undefined) {
    return '';
  }
  const args = Object.entries(operation.arguments)
    .map(([k, argument]) => {
      const baseType = argumentBaseTypeString(argument);
      const finalType = argument.isArray
        ? `[${baseType}]${argument.isArrayNullable ? '' : '!'}`
        : baseType;

      return `$${k}: ${finalType}`;
    })
    .join(', ');

  return args.length > 0 ? `(${args})` : '';
}

/**
 * Generates "inner" arguments string for a custom operation. For example,
 * in this operation:
 *
 * ```graphql
 * query MyQuery(InputString: String!) {
 *   echoString(InputString: $InputString)
 * }
 * ```
 *
 * This function returns the inner arguments as a string:
 *
 * ```json
 * "InputString: $InputString"
 * ```
 *
 * @param operation Operation object from model introspection schema.
 * @returns "outer" arguments string
 */
function innerArguments(operation: CustomOperation): string {
  if (operation.arguments === undefined) {
    return '';
  }
  const args = Object.keys(operation.arguments)
    .map((k) => `${k}: $${k}`)
    .join(', ');

  return args.length > 0 ? `(${args})` : '';
}

/**
 * Generates the selection set string for a custom operation. This is slightly
 * different than the selection set generation for models. If the custom op returns
 * a primitive or enum types, it doesn't require a selection set at all.
 *
 * E.g., the graphql might look like this:
 *
 * ```graphql
 * query MyQuery {
 *   echoString(inputString: "whatever")
 * }
 * #                                     ^
 * #                                     |
 * #                                     +-- no selection set
 * ```
 *
 * Non-primitive return type selection set generation will be similar to other
 * model operations.
 *
 * @param modelIntrospection The full code-generated introspection schema.
 * @param operation The operation object from the schema.
 * @returns The selection set as a string.
 */
function operationSelectionSet(
  modelIntrospection: ModelIntrospectionSchema,
  operation: CustomOperation,
): string {
  if (
    hasStringField(operation, 'type') ||
    hasStringField(operation.type, 'enum')
  ) {
    return '';
  } else if (hasStringField(operation.type, 'nonModel')) {
    const nonModel = modelIntrospection.nonModels[operation.type.nonModel];

    return `{${selectionSetIRToString(
      getDefaultSelectionSetForNonModelWithIR(nonModel, modelIntrospection),
    )}}`;
  } else if (hasStringField(operation.type, 'model')) {
    return `{${generateSelectionSet(modelIntrospection, operation.type.model)}}`;
  } else {
    return '';
  }
}

/**
 * Maps an arguments objec to graphql variables, removing superfluous args and
 * screaming loudly when required args are missing.
 *
 * @param operation The operation to construct graphql request variables for.
 * @param args The arguments to map variables from.
 * @returns The graphql variables object.
 */
function operationVariables(
  operation: CustomOperation,
  args: QueryArgs = {},
): Record<string, unknown> {
  const variables = {} as Record<string, unknown>;
  if (operation.arguments === undefined) {
    return variables;
  }
  for (const argDef of Object.values(operation.arguments)) {
    if (typeof args[argDef.name] !== 'undefined') {
      variables[argDef.name] = args[argDef.name];
    } else if (argDef.isRequired) {
      // At this point, the variable is both required and missing: We don't need
      // to continue. The operation is expected to fail.
      throw new Error(`${operation.name} requires arguments '${argDef.name}'`);
    }
  }

  return variables;
}

/**
 * Executes an operation from the given model intro schema against a client, returning
 * a fully instantiated model when relevant.
 *
 * @param client The client to operate `graphql()` calls through.
 * @param modelIntrospection The model intro schema to construct requests from.
 * @param operationType The high level graphql operation type.
 * @param operation The specific operation name, args, return type details.
 * @param args The arguments to provide to the operation as variables.
 * @param options Request options like headers, etc.
 * @param context SSR context if relevant.
 * @returns Result from the graphql request, model-instantiated when relevant.
 */
function _op(
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  operationType: 'query' | 'mutation',
  operation: CustomOperation,
  getInternals: ClientInternalsGetter,
  args?: QueryArgs,
  options?: AuthModeParams & ListArgs & { [INTERNAL_USER_AGENT_OVERRIDE]?: CustomUserAgentDetails },
  context?: AmplifyServer.ContextSpec,
) {
  return selfAwareAsync(async (resultPromise) => {
    const { name: operationName } = operation;
    const auth = authModeParams(client, getInternals, options);
    const headers = getCustomHeaders(client, getInternals, options?.headers);
    const outerArgsString = outerArguments(operation);
    const innerArgsString = innerArguments(operation);
    const selectionSet = operationSelectionSet(modelIntrospection, operation);

    const returnTypeModelName = hasStringField(operation.type, 'model')
      ? operation.type.model
      : undefined;

    const query = `
    ${operationType.toLocaleLowerCase()}${outerArgsString} {
      ${operationName}${innerArgsString} ${selectionSet}
    }
  `;

    const variables = operationVariables(operation, args);

    const graphqlOptions: GraphQLOptionsWithOverride = {
      ...auth,
      query,
      variables,
    };

    if (options && INTERNAL_USER_AGENT_OVERRIDE in options) {
      graphqlOptions[INTERNAL_USER_AGENT_OVERRIDE] = options[INTERNAL_USER_AGENT_OVERRIDE];
    }

    try {
      const basePromise = context
        ? ((client as BaseSSRClient).graphql(
            context,
            graphqlOptions,
            headers,
          ) as Promise<GraphQLResult>)
        : ((client as BaseBrowserClient).graphql(
          graphqlOptions,
            headers,
          ) as Promise<GraphQLResult>);

      const extendedPromise = extendCancellability(basePromise, resultPromise);
      const { data, extensions } = await extendedPromise;

      // flatten response
      if (data) {
        const [key] = Object.keys(data);

        const isArrayResult = Array.isArray(data[key]);

        // TODO: when adding support for custom selection set, flattening will need
        // to occur recursively. For now, it's expected that related models are not
        // present in the result. Only FK's are present. Any related model properties
        // should be replaced with lazy loaders under the current implementation.
        const flattenedResult = isArrayResult
          ? data[key].filter((x: any) => x)
          : data[key];

        // TODO: custom selection set. current selection set is default selection set only
        // custom selection set requires data-schema-type + runtime updates above.
        const initialized = returnTypeModelName
          ? initializeModel(
              client,
              returnTypeModelName,
              isArrayResult ? flattenedResult : [flattenedResult],
              modelIntrospection,
              auth.authMode,
              auth.authToken,
              !!context,
            )
          : flattenedResult;

        return {
          data:
            !isArrayResult && Array.isArray(initialized)
              ? initialized.shift()
              : initialized,
          extensions,
        };
      } else {
        return { data: null, extensions };
      }
    } catch (error: any) {
      /**
       * The `data` type returned by `error` here could be:
       * 1) `null`
       * 2) an empty object
       * 3) "populated" but with a `null` value `{ getPost: null }`
       * 4) an actual record `{ getPost: { id: '1', title: 'Hello, World!' } }`
       */
      const { data, errors } = error;

      /**
       * `data` is not `null`, and is not an empty object:
       */
      if (data && Object.keys(data).length !== 0 && errors) {
        const [key] = Object.keys(data);

        const isArrayResult = Array.isArray(data[key]);

        // TODO: when adding support for custom selection set, flattening will need
        // to occur recursively. For now, it's expected that related models are not
        // present in the result. Only FK's are present. Any related model properties
        // should be replaced with lazy loaders under the current implementation.
        const flattenedResult = isArrayResult
          ? data[key].filter((x: any) => x)
          : data[key];

        /**
         * `flattenedResult` could be `null` here (e.g. `data: { getPost: null }`)
         * if `flattenedResult`, result is an actual record:
         */
        if (flattenedResult) {
          // TODO: custom selection set. current selection set is default selection set only
          // custom selection set requires data-schema-type + runtime updates above.
          const initialized = returnTypeModelName
            ? initializeModel(
                client,
                returnTypeModelName,
                isArrayResult ? flattenedResult : [flattenedResult],
                modelIntrospection,
                auth.authMode,
                auth.authToken,
                !!context,
              )
            : flattenedResult;

          return {
            data:
              !isArrayResult && Array.isArray(initialized)
                ? initialized.shift()
                : initialized,
            errors,
          };
        } else {
          // was `data: { getPost: null }`)
          return handleSingularGraphQlError(error);
        }
      } else {
        // `data` is `null`:
        return handleSingularGraphQlError(error);
      }
    }
  });
}

/**
 * Executes an operation from the given model intro schema against a client, returning
 * a fully instantiated model when relevant.
 *
 * @param client The client to operate `graphql()` calls through.
 * @param modelIntrospection The model intro schema to construct requests from.
 * @param operation The specific operation name, args, return type details.
 * @param args The arguments to provide to the operation as variables.
 * @param options Request options like headers, etc.
 * @returns Result from the graphql request, model-instantiated when relevant.
 */
function _opSubscription(
  client: BaseBrowserClient,
  modelIntrospection: ModelIntrospectionSchema,
  operation: CustomOperation,
  getInternals: ClientInternalsGetter,
  args?: QueryArgs,
  options?: AuthModeParams & ListArgs & { [INTERNAL_USER_AGENT_OVERRIDE]?: CustomUserAgentDetails },
) {
  const operationType = 'subscription';
  const { name: operationName } = operation;
  const auth = authModeParams(client, getInternals, options);
  const headers = getCustomHeaders(client, getInternals, options?.headers);
  const outerArgsString = outerArguments(operation);
  const innerArgsString = innerArguments(operation);
  const selectionSet = operationSelectionSet(modelIntrospection, operation);

  const returnTypeModelName = hasStringField(operation.type, 'model')
    ? operation.type.model
    : undefined;

  const query = `
    ${operationType.toLocaleLowerCase()}${outerArgsString} {
      ${operationName}${innerArgsString} ${selectionSet}
    }
  `;

  const variables = operationVariables(operation, args);

  const graphqlOptions: GraphQLOptionsWithOverride = {
    ...auth,
    query,
    variables,
  };

  if (options && INTERNAL_USER_AGENT_OVERRIDE in options) {
    graphqlOptions[INTERNAL_USER_AGENT_OVERRIDE] = options[INTERNAL_USER_AGENT_OVERRIDE];
  }

  const observable = client.graphql(
    graphqlOptions,
    headers,
  ) as GraphqlSubscriptionResult;

  return observable.pipe(
    map((value) => {
      const [key] = Object.keys(value.data);
      const data = (value.data as any)[key];

      const [initialized] = returnTypeModelName
        ? initializeModel(
            client,
            returnTypeModelName,
            [data],
            modelIntrospection,
            auth.authMode,
            auth.authToken,
          )
        : [data];

      return initialized;
    }),
  );
}
