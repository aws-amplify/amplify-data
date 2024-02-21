const brandSymbol = Symbol('__BRAND');

type Brand<B extends string> = { [brandSymbol]: B };

function brand<B extends string>(name: B): Brand<B> {
  return { [brandSymbol]: name };
}

const brandName = '__HANDLER';

type HandlerTypes = 'sql' | 'dynamodb';

export type HandlerType<T extends HandlerTypes> = {
  type: Brand<T>;
};

function handlerType<T extends HandlerTypes>(type: T): HandlerType<T> {
  return { type: brand(type) };
}

export type Handler<T extends HandlerTypes> = Brand<typeof brandName> &
  HandlerType<T>;

function buildHandler<T extends HandlerTypes>(type: T): Handler<T> {
  return { ...brand(brandName), ...handlerType(type) };
}

type InlineSqlResult = {
  sql: string;
} & Handler<'sql'>;
function inlineSql(sql: string): InlineSqlResult {
  return { sql, ...buildHandler('sql') };
}

type SqlReferenceResult = {
  sqlReference: string;
} & Handler<'sql'>;
function sqlReference(sqlReference: string): SqlReferenceResult {
  return { sqlReference, ...buildHandler('sql') };
}

type CustomResult = {
  file: string;
} & Handler<'sql'>;
function custom(file: string): CustomResult {
  return { file, ...buildHandler('sql') };
}

type FunctionResult = {
  fcn: (...args: any[]) => any;
} & Handler<'sql'>;
function fcn(fcn: (...args: any[]) => any): FunctionResult {
  return { fcn, ...buildHandler('sql') };
}

// type HandlerFunctions = <MS extends ModelSchema<any, any>>(
//   schema: MS,
//   ...args: any[]
// ) => InlineSqlResult | SqlReferenceResult | CustomResult | FunctionResult;

// type HandlerRecord<HF extends HandlerFunctions> = Record<string, HF>

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
