import type { DefineFunction } from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';
import type { brandSymbol } from './util/Brand.js';
import { RefType } from './RefType';

export type HandlerType =
  | InlineSqlHandler
  | SqlReferenceHandler
  | CustomHandler
  | FunctionHandler
  | AsyncFunctionHandler;

const dataSymbol = Symbol('Data');

function buildHandler<B extends string>(brandName: B): Brand<B> {
  return brand(brandName);
}

type AllHandlers =
  | InlineSqlHandler
  | SqlReferenceHandler
  | CustomHandler
  | FunctionHandler
  | AsyncFunctionHandler;

export function getHandlerData<H extends AllHandlers>(
  handler: H,
): H[typeof dataSymbol] {
  return handler[dataSymbol];
}

//#region handler.inlineSql

const inlineSqlBrand = 'inlineSql';

export type InlineSqlHandler = {
  [dataSymbol]: string;
  [brandSymbol]: typeof inlineSqlBrand;
};

function inlineSql(sql: string): InlineSqlHandler {
  return { [dataSymbol]: sql, ...buildHandler(inlineSqlBrand) };
}

//#endregion

//#region handler.sqlReference

const sqlReferenceBrand = 'sqlReference';

export type SqlReferenceHandlerData = {
  entry: string;
  stack: string | undefined;
};

export type SqlReferenceHandler = {
  [dataSymbol]: SqlReferenceHandlerData;
  [brandSymbol]: typeof sqlReferenceBrand;
};

function sqlReference(sqlFilePath: string): SqlReferenceHandler {
  // used to determine caller directory in order to resolve relative path downstream
  const stack = new Error().stack;
  return {
    [dataSymbol]: { stack, entry: sqlFilePath },
    ...buildHandler(sqlReferenceBrand),
  };
}

//#endregion

//#region handler.custom

type CustomHandlerInput = {
  /**
   * The data source used by the function.
   * Can reference a model in the schema with a.ref('ModelName') or any string data source name configured in your API
   *
   * Defaults to 'NONE_DS'
   *
   */
  dataSource?: string | RefType<any>;
  /**
   * The path to the file that contains the function entry point.
   * If this is a relative path, it is computed relative to the file where this handler is defined
   */
  entry: string;
};

export type CustomHandlerData = CustomHandlerInput & {
  stack: string | undefined;
};

const customHandlerBrand = 'customHandler';

export type CustomHandler = {
  [dataSymbol]: CustomHandlerData;
  [brandSymbol]: typeof customHandlerBrand;
};

/**
 * Use a custom JavaScript resolver to handle a query, mutation, or subscription.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/#step-2---configure-custom-business-logic-handler-code}
 * @param customHandler `{ entry: "path-to-javascript-resolver-file.js", dataSource: "Data Source name added via "backend.data.add*DataSoruce(...)"}`
 * @returns A JavaScript resolver attached to the query, mutation, or subscription.
 * @example
 * const schema = a.schema({
 *   Post: a.model({
 *     content: a.string(),
 *     likes: a.integer()
 *       .authorization(allow => [allow.authenticated().to(['read'])])
 *   }).authorization(allow => [
 *     allow.owner(),
 *     allow.authenticated().to(['read'])
 *   ]),
 *
 *   likePost: a
 *     .mutation()
 *     .arguments({ postId: a.id() })
 *     .returns(a.ref('Post'))
 *     .authorization(allow => [allow.authenticated()])
 *     .handler(a.handler.custom({
 *       dataSource: a.ref('Post'),
 *       entry: './increment-like.js'
 *     }))
 * });
 */
function custom(customHandler: CustomHandlerInput): CustomHandler {
  // used to determine caller directory in order to resolve relative path downstream
  const stack = new Error().stack;
  return {
    [dataSymbol]: { ...customHandler, stack },
    ...buildHandler(customHandlerBrand),
  };
}

//#endregion

//#region handler.function
export type FunctionHandlerInput = DefineFunction | string;
export type FunctionHandlerData = {
  handler: FunctionHandlerInput;
  invocationType: 'RequestResponse' | 'Event';
};

const functionHandlerBrand = 'functionHandler';

export type FunctionHandler = {
  [dataSymbol]: FunctionHandlerData;
  /**
   * Use `async()` to have this function handler invoked asynchronously.
   * If an `async()` function is only handler or the final handler in a pipeline, the return type of this
   * custom query / mutation is `{ success: boolean }`.
   * @example
   * import {
   *   type ClientSchema,
   *   a,
   *   defineData,
   *   defineFunction // 1.Import "defineFunction" to create new functions
   * } from '@aws-amplify/backend';
   *
   * // 2. define a function
   * const echoHandler = defineFunction({
   *   entry: './echo-handler/handler.ts'
   * })
   *
   * const schema = a.schema({
   *   EchoResponse: a.customType({
   *     content: a.string(),
   *     executionDuration: a.float()
   *   }),
   *
   *   echo: a
   *     .query()
   *     .arguments({ content: a.string() })
   *     .returns(a.ref('EchoResponse'))
   *     .authorization(allow => [allow.publicApiKey()])
   *     // 3. set the function has the handler
   *     .handler(a.handler.function(echoHandler).async())
   *
   * @see {@link https://docs.amplify.aws/react/build-a-backend/data/INSERT_PATH_WHEN_READY}
   * @returns A function handler for query / mutation that is asynchronously invoked.
   */
  async(): AsyncFunctionHandler;
  [brandSymbol]: typeof functionHandlerBrand;
};

const asyncFunctionHandlerBrand = 'asyncFunctionHandler';

export type AsyncFunctionHandler = {
  [dataSymbol]: FunctionHandlerData;
  [brandSymbol]: typeof asyncFunctionHandlerBrand;
};

/**
 * Use a function created via `defineFunction` to handle the custom query/mutation/subscription. In your function handler,
 * you can use the `Schema["YOUR_QUERY_OR_MUTATION_NAME"]["functionHandler"]` utility type to type the handler function.
 * @example
 * import {
 *   type ClientSchema,
 *   a,
 *   defineData,
 *   defineFunction // 1.Import "defineFunction" to create new functions
 * } from '@aws-amplify/backend';
 *
 * // 2. define a function
 * const echoHandler = defineFunction({
 *   entry: './echo-handler/handler.ts'
 * })
 *
 * const schema = a.schema({
 *   EchoResponse: a.customType({
 *     content: a.string(),
 *     executionDuration: a.float()
 *   }),
 *
 *   echo: a
 *     .query()
 *     .arguments({ content: a.string() })
 *     .returns(a.ref('EchoResponse'))
 *     .authorization(allow => [allow.publicApiKey()])
 *     // 3. set the function has the handler
 *     .handler(a.handler.function(echoHandler))
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @param fn A function created via `defineFunction`. Alternatively, you can pass in a "string" of the function name and pass
 * in a corresponding value into the `functionMap` property of defineData.
 * @returns A handler for the query / mutation / subscription
 */
function fcn(fn: FunctionHandlerInput): FunctionHandler {
  return {
    [dataSymbol]: {
      handler: fn,
      invocationType: 'RequestResponse',
    },
    async() {
      return _async(this);
    },
    ...buildHandler(functionHandlerBrand),
  };
}

function _async(fnHandler: FunctionHandler): AsyncFunctionHandler {
  return {
    [dataSymbol]: {
      handler: fnHandler[dataSymbol].handler,
      invocationType: 'Event',
    },
    ...buildHandler(asyncFunctionHandlerBrand),
  };
}

//#endregion

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
