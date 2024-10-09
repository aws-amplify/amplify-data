import {
  GraphQLError,
  print,
  parse,
  DocumentNode,
  TypeNode,
  ObjectTypeDefinitionNode,
} from 'graphql';
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
 * This helps facilitate a test structure where as much mocking is done ahead of
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

  _graphqlspy.mockImplementation(async (_amplify: any, _options: any) => {
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

  _graphqlsubspy.mockImplementation((_amplify: any, options: any) => {
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
    return actualGenerateServerClientUsingReqRes<T>(options);
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
  // the types inferred from `parse` appear to just be wrong. they do not align with the actual AST.
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

  const selectionSetString: string = selectionSetFromAST(
    selections?.selectionSet?.selections,
  );

  return {
    operation,
    selection,
    type,
    table,
    selectionSet,
    selectionSetString,
  };
}

function selectionSetFromAST(selections: any) {
  const fields = [] as any;
  for (const s of selections || []) {
    if (s.selectionSet) {
      fields.push(
        `${s.name.value} { ${selectionSetFromAST(s.selectionSet.selections)} }`,
      );
    } else {
      fields.push(s.name.value);
    }
  }
  return fields.join(' ');
}

export function findModelNode(ast: DocumentNode, modelName: string) {
  for (const def of ast.definitions) {
    if (def.kind === 'ObjectTypeDefinition' && def.name.value === modelName) {
      return def;
    }
  }
  return undefined;
}

export function findFieldNode(
  modelNode: ObjectTypeDefinitionNode,
  fieldName: string,
) {
  for (const field of modelNode.fields || []) {
    if (field.kind === 'FieldDefinition' && field.name.value === fieldName) {
      return field;
    }
  }
  return undefined;
}

/**
 * Condenses spacing/trimming of a selection set specified as a graphql string, but
 * does *not* normalize field ordering and does not *add* spacing. E.g.,
 *
 * ```plain
 *  id
 *  description
 *  details {
 *    content
 *  }
 *  steps {
 *    items {
 *      id description todoId
 *    }
 *  }
 * ```
 *
 * Becomes:
 *
 * ```plain
 * id description details { content } steps { items { id description todoId } }
 * ```
 *
 * @param selectionSet Selection set as a graphql string
 * @returns
 */
export function condenseSelectionSet(selectionSet: string) {
  return selectionSet.replace(/[\s\r\n]+/g, ' ').trim();
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

export function expectSelectionSetEquals(
  spy: jest.SpyInstance,
  selectionSet: string,
  requestIndex = 0,
) {
  const [options] = optionsAndHeaders(spy)[requestIndex];
  const { query } = options;
  const { selectionSetString } = parseQuery(query);
  expect(selectionSetString).toEqual(condenseSelectionSet(selectionSet));
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

  const modelDef = findModelNode(ast, model);
  if (!modelDef) throw new Error('No matching definition found in the schema.');

  const fieldDef = findFieldNode(modelDef, field);
  if (!fieldDef) throw new Error('No matching definition found in the schema.');

  const matches = graphqlFieldMatches({
    def: fieldDef.type,
    type,
    isRequired,
    isArray,
  });
  if (matches) {
    return true;
  } else {
    throw new Error(
      `${JSON.stringify(fieldDef, null, 2)} does not match ${JSON.stringify({
        type,
        isArray,
        isRequired,
      })}`,
    );
  }
}

export function expectSchemaFieldDirective({
  schema,
  model,
  field,
  directive,
}: {
  schema: string;
  model: string;
  field: string;
  directive: string;
}) {
  const ast = parse(schema);

  const modelDef = findModelNode(ast, model);
  if (!modelDef) throw new Error('No matching definition found in the schema.');

  const fieldDef = findFieldNode(modelDef, field);
  if (!fieldDef) throw new Error('No matching definition found in the schema.');

  if (fieldDef.directives?.some((d) => print(d) === directive)) {
    return true;
  } else {
    throw new Error(
      `No match for "${model} ${directive}" in \n${JSON.stringify(
        fieldDef.directives?.map((d) => print(d)),
        null,
        2,
      )} `,
    );
  }
}

export function expectSchemaModelDirective({
  schema,
  model,
  directive,
}: {
  schema: string;
  model: string;
  directive: string;
}) {
  const ast = parse(schema);

  const modelDef = findModelNode(ast, model);
  if (!modelDef) throw new Error('No matching definition found in the schema.');

  if (modelDef.directives?.some((d) => print(d) === directive)) {
    return true;
  } else {
    throw new Error(
      `No match for "${model} ${directive}" in \n${JSON.stringify(
        modelDef.directives?.map((d) => print(d)),
        null,
        2,
      )} `,
    );
  }
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

  const modelDef = findModelNode(ast, model);
  if (!modelDef) return true; // field can't exist if the model doesn't!

  const fieldDef = findFieldNode(modelDef, field);
  if (!fieldDef) return true; // exactly what we're asserting.

  // else, we found the field, whereas we were "hoping" for its absence.
  throw new Error(`Field '${field}' unexpectedly exists on '${model}'`);
}

/**
 * Performs a normalized comparison of actual and expected GraphQL strings.
 *
 * Normalizes the strings by parsing and re-printing each.
 *
 * Logs the strings and throws on mismatch.
 *
 * @param actual GraphQL string
 * @param expected GraphQL string
 */
export function expectGraphqlMatches(actual: string, expected: string) {
  const actualNormalized = print(parse(actual));
  const expectedNormalized = print(parse(expected));
  if (actualNormalized !== expectedNormalized) {
    console.error(
      [
        `Actual:\n${actual}`,
        `Actual (normalized):\n${actualNormalized}`,
        `Expected (normalized):\n${expectedNormalized}`,
      ].join('\n\n'),
    );
    throw new Error('Actual and Expected graphql does not match.');
  }
}
