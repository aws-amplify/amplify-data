export { Brand, brand, getBrand } from './Brand';
export { IndexLimitUnion } from './IndexLimit';
export { KindaPretty } from './KindaPretty';
export { ObjectFromEntries } from './ObjectFromEntries';
export { SpreadTuple } from './SpreadTuple';
export { Select } from './Select';
export type * from './Filters';
export type * from './IndexShapes';
export type * from './Rename';

/**
 * Utility type that checks if a type extends `never`.
 * Returns `true` if T is `never`, `false` otherwise.
 *
 * This is useful for conditional type logic where we need to
 * detect if a generic parameter was not provided (defaults to never).
 */
export type ExtendsNever<T> = [T] extends [never] ? true : false;
