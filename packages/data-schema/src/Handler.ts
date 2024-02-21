import { Brand, brand } from './util';

const brandName = 'Handler';

export type Handler = Brand<typeof brandName>;

function buildHandler(): Handler {
  return brand(brandName);
}

type InlineSqlResult = {
  sql: string;
} & Handler;
function inlineSql(sql: string): InlineSqlResult {
  return { sql, ...buildHandler() };
}

type SqlReferenceResult = {
  sqlReference: string;
} & Handler;
function sqlReference(sqlReference: string): SqlReferenceResult {
  return { sqlReference, ...buildHandler() };
}

type CustomResult = {
  custom: string;
} & Handler;
function custom(file: string): CustomResult {
  return { custom: file, ...buildHandler() };
}

type FunctionResult = {
  function: (...args: any[]) => any;
} & Handler;
function fcn(fcn: (...args: any[]) => any): FunctionResult {
  return { function: fcn, ...buildHandler() };
}

export const handler = {
  inlineSql,
  sqlReference,
  custom,
  function: fcn,
};
