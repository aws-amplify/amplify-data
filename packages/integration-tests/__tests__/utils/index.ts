import { GraphQLError, print, parse, DocumentNode, TypeNode } from 'graphql';
import { generateModels } from '@aws-amplify/graphql-generator';
import { generateClient as actualGenerateClient } from 'aws-amplify/api';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  generateServerClientUsingCookies as actualGenerateServerClientUsingCookies,
  generateServerClientUsingReqRes as actualGenerateServerClientUsingReqRes,
} from '@aws-amplify/adapter-nextjs/data';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  GraphQLAPI,
  GraphQLResult as RuntimeGraphQLResult,
} from '@aws-amplify/api-graphql';
import { Observable, Subscriber } from 'rxjs'; // eslint-disable-line
import { Amplify } from 'aws-amplify';

const graphqlspy = jest.spyOn(GraphQLAPI as any, 'graphql');
const _graphqlspy = jest.spyOn(GraphQLAPI as any, '_graphql');
const _graphqlsubspy = jest.spyOn(GraphQLAPI as any, '_graphqlSubscribe');

/**
 * @param value Value to be returned. Will be `awaited`, and can
 * therefore be a simple JSON value or a `Promise`.
 * @returns
 */
export function mockApiResponse<T>(client: T, value: any) {
  return jest.spyOn(client as any, 'graphql').mockImplementation(async () => {
    return value;
  });
}

export interface GraphQLResult<T = object | null>
  extends RuntimeGraphQLResult<T> {}

/**
 * Represents current runtime behavior: passes through `data` as-is, but wraps
 * `error` in a `GraphQLError`. `data` here is processed by the runtime
 * in these tests.
 */
const createMockGraphQLResultWithError = <T>(
  data: any,
  error: Error,
): GraphQLResult<T> => {
  return {
    data,
    errors: [new GraphQLError(error.message, null, null, null, null, error)],
  };
};

/**
 * @param schema Return value from `a.schema()`
 * @returns JSON Amplify config with model intro schema and dummy appsync config.
 */
export async function buildAmplifyConfig(schema: {
  transform: () => { schema: string };
}) {
  return {
    aws_project_region: 'us-east-2',
    aws_appsync_graphqlEndpoint: 'https://localhost/graphql',
    aws_appsync_region: 'us-west-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: 'FAKE-KEY',
    modelIntrospection: JSON.parse(
      (
        await generateModels({
          schema: schema.transform().schema,
          target: 'introspection',
          directives: '',
        })
      )['model-introspection.json'] as any,
    ),
  };
}

/**
 * Produces a `generateClient` function and associated spy that is pre-configured
 * to return the given list of responses in order.
 *
 * This helps facilitate a test structure where as much mocking as done ahead of
 * time as possible, so that the test body can show "actual customer code" to the
 * greatest degree possible.
 *
 * @param responses List of GraphQL responses to issue in order
 * @returns
 */
export function mockedGenerateClient(
  responses: (
    | GraphQLResult
    | (() => GraphQLResult)
    | (() => Promise<GraphQLResult>)
  )[],
) {
  const subs = {} as Record<string, Subscriber<any>>;

  _graphqlspy.mockImplementation(async () => {
    const result = responses.shift();

    if (typeof result === 'function') {
      return result();
    } else {
      if (result && Array.isArray(result.errors) && result.errors.length > 0) {
        throw createMockGraphQLResultWithError(
          result.data,
          new Error(result.errors[0].message),
        );
      }
      return result;
    }
  });

  _graphqlsubspy.mockImplementation((amplify: any, options: any) => {
    const graphql = print(options.query);
    const operationMatch = graphql.match(/\s+(on(Create|Update|Delete)\w+)/);
    const operation = operationMatch?.[1];
    return new Observable((subscriber) => {
      operation && (subs[operation] = subscriber);
    });
  });

  function generateClient<T extends Record<any, any>>(
    options?: Parameters<typeof actualGenerateClient>[0],
  ) {
    return actualGenerateClient<T>(options);
  }

  function generateServerClientUsingCookies<T extends Record<any, any>>(
    options: Parameters<typeof actualGenerateServerClientUsingCookies>[0],
  ) {
    return actualGenerateServerClientUsingCookies<T>(options);
  }

  function generateServerClientUsingReqRes<T extends Record<any, any>>(
    options: Parameters<typeof actualGenerateServerClientUsingReqRes>[0],
  ) {
    return actualGenerateServerClientUsingReqRes(options);
  }

  return {
    spy: graphqlspy,
    innerSpy: _graphqlspy,
    subSpy: _graphqlsubspy,
    subs,
    generateClient,
    generateServerClientUsingCookies,
    generateServerClientUsingReqRes,
  };
}

/**
 * Returns calls to a `.graphql` spy minus the Amplify context object.
 *
 * @param spy `spy` returned from `mockGeneratedClient`
 * @returns
 */
export function optionsAndHeaders(spy: jest.SpyInstance) {
  return spy.mock.calls.map((call: any) => {
    const [amplify, options, additionalHeaders] = call;
    return [options, additionalHeaders];
  });
}

/**
 * Returns calls to a `.graphql` spy minus the Amplify context object.
 *
 * @param spy `spy` returned from `mockGeneratedClient`
 * @returns
 */
export function subOptionsAndHeaders(spy: jest.SpyInstance) {
  return spy.mock.calls.map((call: any) => {
    const [amplify, options, additionalHeaders] = call;
    options.query = print(options.query);
    return [options, additionalHeaders];
  });
}

/**
 * Very shallow mock of a `useState` hook. Pretty much just deep enough to demonstrate
 * how our modeling works with React hooks.
 *
 * @param init
 * @returns
 */
export function useState<T>(init: T) {
  const setter = jest.fn<any, [T]>();
  return [init as T, setter] as const;
}

export async function pause(ms: number) {
  return new Promise((unsleep) => setTimeout(unsleep, ms));
}

/**
 * Given the plural name of a model, find the singular name.
 *
 * Assumes `Amplify.configure()` has already called with a config
 * holding a valid `modelIntrospection` schema.
 *
 * @param pluralName plural name of model (e.g. "Todos")
 * @returns singular name of model (e.g. "Todo")
 */
export function findSingularName(pluralName: string): string {
  const config = Amplify.getConfig();
  const model = Object.values(
    config.API?.GraphQL?.modelIntrospection?.models || {},
  ).find((m) => m.pluralName === pluralName);
  if (!model) throw new Error(`No model found for plural name ${pluralName}`);
  return model.name;
}

export function parseQuery(query: string | DocumentNode) {
  const q: any =
    typeof query === 'string'
      ? parse(query).definitions[0]
      : parse(print(query)).definitions[0];

  const operation: string = q.operation;
  const selections = q.selectionSet.selections[0];
  const selection: string = selections.name.value;
  const type = selection.match(
    /^(create|update|delete|sync|get|list|onCreate|onUpdate|onDelete)(\w+)$/,
  )?.[1] as string;

  let table: string;
  // `selection` here could be `syncTodos` or `syncCompositePKChildren`
  if (type === 'sync' || type === 'list') {
    // e.g. `Models`
    const pluralName = selection.match(
      /^(create|sync|get|list)([A-Za-z]+)$/,
    )?.[2] as string;
    table = findSingularName(pluralName);
  } else {
    table = selection.match(
      /^(create|update|delete|sync|get|list|onCreate|onUpdate|onDelete)(\w+)$/,
    )?.[2] as string;
  }

  const selectionSet: string[] =
    operation === 'query'
      ? selections?.selectionSet?.selections[0]?.selectionSet?.selections?.map(
          (i: any) => i.name.value,
        )
      : selections?.selectionSet?.selections?.map((i: any) => i.name.value);

  return { operation, selection, type, table, selectionSet };
}

export function expectSelectionSetContains(
  spy: jest.SpyInstance,
  fields: string[],
  requestIndex = 0,
) {
  const [options] = optionsAndHeaders(spy)[requestIndex];
  const { query } = options;
  const { selectionSet } = parseQuery(query);
  expect(fields.every((f) => selectionSet.includes(f))).toBe(true);
}

export function expectSelectionSetNotContains(
  spy: jest.SpyInstance,
  fields: string[],
  requestIndex = 0,
) {
  const [options] = optionsAndHeaders(spy)[requestIndex];
  const { query } = options;
  const { selectionSet } = parseQuery(query);
  expect(fields.every((f) => !selectionSet.includes(f))).toBe(true);
}

export function expectVariables(
  spy: jest.SpyInstance,
  expectedVariables: Record<string, any>,
  requestIndex = 0,
) {
  const [options] = optionsAndHeaders(spy)[requestIndex];
  const { variables } = options;
  expect(variables).toEqual(expectedVariables);
}

export function parseGraphqlSchema(schema: string) {
  const ast = parse(schema);
  return ast;
}

export function expectSchemaModelContains({
  schema,
  model,
  field,
  type,
  isRequired,
  isArray,
}: {
  schema: string;
  model: string;
  field: string;
  type: string;
  isRequired: boolean;
  isArray: boolean;
}) {
  const ast = parse(schema);
  for (const def of ast.definitions) {
    if (def.kind === 'ObjectTypeDefinition') {
      if (def.name.value === model) {
        for (const _field of def.fields || []) {
          if (_field.kind === 'FieldDefinition') {
            if (_field.name.value === field) {
              const matches = graphqlFieldMatches({
                def: _field.type,
                type,
                isRequired,
                isArray,
              });
              if (matches) {
                return true;
              } else {
                throw new Error(
                  `${JSON.stringify(
                    _field,
                    null,
                    2,
                  )} does not match ${JSON.stringify({
                    type,
                    isArray,
                    isRequired,
                  })}`,
                );
              }
            }
          }
        }
      }
    }
  }
  throw new Error('No matching definition found in the schema.');
}

function graphqlFieldMatches({
  def,
  type,
  isRequired,
  isArray,
}: {
  def: TypeNode;
  type: string;
  isRequired: boolean;
  isArray: boolean;
}) {
  if (def.kind === 'NamedType') {
    return isArray === false && isRequired === false && def.name.value === type;
  }

  if (def.kind === 'NonNullType') {
    // "consume" the isRequired requirement
    if (!isRequired) return false;

    return graphqlFieldMatches({
      def: def.type,
      type,
      isArray,
      isRequired: false, // already consumed
    });
  }

  if (def.kind === 'ListType') {
    // "consume" the isArray requirement.
    if (!isArray) return false;

    return graphqlFieldMatches({
      def: def.type,
      type,
      isRequired,
      isArray: false, // already consumed
    });
  }

  throw new Error("Ruhoh. The `def` you gave me isn't actually a `TypeNode`!");
}

export function expectSchemaModelExcludes({
  schema,
  model,
  field,
}: {
  schema: string;
  model: string;
  field: string;
}) {
  const ast = parse(schema);
  for (const def of ast.definitions) {
    if (def.kind === 'ObjectTypeDefinition') {
      if (def.name.value === model) {
        for (const _field of def.fields || []) {
          if (_field.kind === 'FieldDefinition') {
            if (_field.name.value === field) {
              throw new Error(
                `Field '${field}' unexpectedly exists on '${model}'`,
              );
            }
          }
        }
      }
    }
  }
}
