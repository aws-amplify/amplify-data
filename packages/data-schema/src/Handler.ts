import type { DefineFunction } from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';
import { RefType } from './RefType';

export type HandlerType =
  | InlineSqlHandler
  | SqlReferenceHandler
  | CustomHandler
  | FunctionHandler;

const dataSymbol = Symbol('Data');

function buildHandler<B extends string>(brandName: B): Brand<B> {
  return brand(brandName);
}

type AllHandlers =
  | InlineSqlHandler
  | SqlReferenceHandler
  | CustomHandler
  | FunctionHandler;

export function getHandlerData<H extends AllHandlers>(
  handler: H,
): H[typeof dataSymbol] {
  return handler[dataSymbol];
}

//#region handler.inlineSql

const inlineSqlBrand = 'inlineSql';

export type InlineSqlHandler = { [dataSymbol]: string } & Brand<
  typeof inlineSqlBrand
>;

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
} & Brand<typeof sqlReferenceBrand>;

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

export type CustomHandler = { [dataSymbol]: CustomHandlerData } & Brand<
  typeof customHandlerBrand
>;

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

export type FunctionHandlerData = DefineFunction | string;

const functionHandlerBrand = 'functionHandler';

export type FunctionHandler = {
  [dataSymbol]: FunctionHandlerData;
} & Brand<typeof functionHandlerBrand>;

function fcn(fn: FunctionHandlerData): FunctionHandler {
  return { [dataSymbol]: fn, ...buildHandler(functionHandlerBrand) };
}

//#endregion

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
