import { Brand, brand } from './util';
import { RefType } from './RefType';

const brandName = 'Handler';

export type Handler = Brand<typeof brandName>;
export type HandlerType =
  | InlineSqlResult[]
  | SqlReferenceResult[]
  | CustomResult[]
  | FunctionResult[];

function buildHandler(): Handler {
  return brand(brandName);
}

export type InlineSqlResult = {
  type: 'sql';
  data: string;
} & Handler;
function inlineSql(data: string): InlineSqlResult {
  return { type: 'sql', data, ...buildHandler() };
}

export type SqlReferenceResult = {
  type: 'sqlReference';
  data: string;
} & Handler;
function sqlReference(data: string): SqlReferenceResult {
  return { type: 'sqlReference', data, ...buildHandler() };
}

type CustomResultData = {
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
   * If this is a relative path, it is computed relative to the file where this function is defined
   */
  entry: string;
};

export type CustomResult = {
  type: 'custom';
  data: CustomResultData;
} & Handler;
function custom(data: CustomResultData): CustomResult {
  return { type: 'custom', data, ...buildHandler() };
}

export type FunctionResult = {
  type: 'function';
  data: (...args: any[]) => any;
} & Handler;
function fcn(data: (...args: any[]) => any): FunctionResult {
  return { type: 'function', data, ...buildHandler() };
}

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
