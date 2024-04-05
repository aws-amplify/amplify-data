// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AmplifyServer,
  CustomOperation,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import { map } from 'rxjs';

import {
  authModeParams,
  defaultSelectionSetForNonModelWithIR,
  flattenItems,
  generateSelectionSet,
  getCustomHeaders,
  initializeModel,
  selectionSetIRToString,
} from '../APIClient';
import {
  AuthModeParams,
  ClientWithModels,
  GraphQLResult,
  GraphqlSubscriptionResult,
  ListArgs,
  QueryArgs,
  V6Client,
  V6ClientSSRRequest,
} from '../../types';

type CustomOperationOptions = AuthModeParams & ListArgs;

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
  client: ClientWithModels,
  modelIntrospection: ModelIntrospectionSchema,
  operationType: 'query' | 'mutation' | 'subscription',
  operation: CustomOperation,
  useContext: boolean,
) {
  // .arguments() are defined for the custom operation in the schema builder
  // and are present in the model introspection schema
  const argsDefined = operation.arguments !== undefined;

  const op = (...args: OpArgs) => {
    // options is always the last argument
    const options = args[args.length - 1] as CustomOperationOptions;

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
        client as V6Client<Record<string, any>>,
        modelIntrospection,
        operation,
        arg,
        options,
      );
    }

    return _op(
      client,
      modelIntrospection,
      operationType,
      operation,
      arg,
      options,
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
    .map(([k, v]) => {
      const baseType = v.type + (v.isRequired ? '!' : '');
      const finalType = v.isArray
        ? `[${baseType}]${v.isArrayNullable ? '' : '!'}`
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
 * a primitive or enum types, it doen't require a selection set at all.
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
      defaultSelectionSetForNonModelWithIR(nonModel, modelIntrospection),
    )}}`;
  } else if (hasStringField(operation.type, 'model')) {
    return `{${generateSelectionSet(
      modelIntrospection,
      operation.type.model,
    )}}`;
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
async function _op(
  client: ClientWithModels,
  modelIntrospection: ModelIntrospectionSchema,
  operationType: 'query' | 'mutation',
  operation: CustomOperation,
  args?: QueryArgs,
  options?: AuthModeParams & ListArgs,
  context?: AmplifyServer.ContextSpec,
) {
  const { name: operationName } = operation;
  const auth = authModeParams(client, options);
  const headers = getCustomHeaders(client, options?.headers);
  const outerArgsString = outerArguments(operation);
  const innerArgsString = innerArguments(operation);
  const selectionSet = operationSelectionSet(modelIntrospection, operation);

  const returnTypeModelName = hasStringField(operation.type, 'model')
    ? operation.type.model
    : undefined;

  const query = `${operationType.toLocaleLowerCase()}${outerArgsString} {
    ${operationName}${innerArgsString} ${selectionSet}
  }`;

  const variables = operationVariables(operation, args);

  try {
    const { data, extensions } = context
      ? ((await (client as V6ClientSSRRequest<Record<string, any>>).graphql(
          context,
          {
            ...auth,
            query,
            variables,
          },
          headers,
        )) as GraphQLResult<any>)
      : ((await (client as V6Client<Record<string, any>>).graphql(
          {
            ...auth,
            query,
            variables,
          },
          headers,
        )) as GraphQLResult<any>);

    // flatten response
    if (data) {
      const [key] = Object.keys(data);
      const flattenedResult = flattenItems(data)[key];

      // TODO: custom selection set. current selection set is default selection set only
      // custom selection set requires data-schema-type + runtime updates above.
      const [initialized] = returnTypeModelName
        ? initializeModel(
            client,
            returnTypeModelName,
            [flattenedResult],
            modelIntrospection,
            auth.authMode,
            auth.authToken,
            !!context,
          )
        : [flattenedResult];

      return { data: initialized, extensions };
    } else {
      return { data: null, extensions };
    }
  } catch (error: any) {
    if (error.errors) {
      // graphql errors pass through
      return error as any;
    } else {
      // non-graphql errors re re-thrown
      throw error;
    }
  }
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
  client: V6Client<Record<string, any>>,
  modelIntrospection: ModelIntrospectionSchema,
  operation: CustomOperation,
  args?: QueryArgs,
  options?: AuthModeParams & ListArgs,
) {
  const operationType = 'subscription';
  const { name: operationName } = operation;
  const auth = authModeParams(client, options);
  const headers = getCustomHeaders(client, options?.headers);
  const outerArgsString = outerArguments(operation);
  const innerArgsString = innerArguments(operation);
  const selectionSet = operationSelectionSet(modelIntrospection, operation);

  const returnTypeModelName = hasStringField(operation.type, 'model')
    ? operation.type.model
    : undefined;

  const query = `${operationType.toLocaleLowerCase()}${outerArgsString} {
    ${operationName}${innerArgsString} ${selectionSet}
  }`;

  const variables = operationVariables(operation, args);

  const observable = client.graphql(
    {
      ...auth,
      query,
      variables,
    },
    headers,
  ) as GraphqlSubscriptionResult<object>;

  return observable.pipe(
    map((value) => {
      const [key] = Object.keys(value.data);
      const data = (value.data as any)[key];

      const [initialized] = returnTypeModelName
        ? initializeModel(
            client as V6Client<Record<string, any>>,
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
