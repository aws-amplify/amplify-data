import { Brand, brand } from './util';
import { RefType } from './RefType';

export type HandlerType =
  | InlineSqlHandler[]
  | SqlReferenceHandler[]
  | CustomHandler[]
  | FunctionHandler[];

const data = Symbol('Data');

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
): H[typeof data] {
  return handler[data];
}

const inlineSqlBrand = 'inlineSql';

export type InlineSqlHandler = { [data]: string } & Brand<
  typeof inlineSqlBrand
>;

function inlineSql(sql: string): InlineSqlHandler {
  return { [data]: sql, ...buildHandler(inlineSqlBrand) };
}

const sqlReferenceBrand = 'sqlReference';

export type SqlReferenceHandler = { [data]: string } & Brand<
  typeof sqlReferenceBrand
>;

function sqlReference(sqlReference: string): SqlReferenceHandler {
  return { [data]: sqlReference, ...buildHandler(sqlReferenceBrand) };
}

type CustomHandlerInput = {
  /**
   * The data source used by the function.
   * Can reference a model in the schema with a.ref('ModelName') or any string data source name configured in your API
   *
   * Defaults to 'NONE_DS'
   *
   */
  dataSource?: string | RefType<any, any, any>;
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

export type CustomHandler = { [data]: CustomHandlerData } & Brand<
  typeof customHandlerBrand
>;

function custom(customHandler: CustomHandlerInput): CustomHandler {
  // used to determine caller directory in order to resolve relative path downstream
  const stack = new Error().stack;
  return {
    [data]: { ...customHandler, stack },
    ...buildHandler(customHandlerBrand),
  };
}

const functionHandlerBrand = 'functionHandler';

export type FunctionHandler = {
  [data]: (...args: any[]) => any;
} & Brand<typeof functionHandlerBrand>;

function fcn(fn: (...args: any[]) => any): FunctionHandler {
  return { [data]: fn, ...buildHandler(functionHandlerBrand) };
}

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
