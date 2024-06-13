import { ObjectFromEntries } from './ObjectFromEntries';

/**
 * Renames keys of an object using renaming tuples. E.g.,
 *
 * Using this object:
 *
 * ```ts
 * type O = {
 *  keyA: A,
 *  keyB: B,
 *  keyC: C,
 * }
 * ```
 *
 * And this rename map:
 *
 * ```ts
 * type R = [
 *  ['keyA', 'renamedA'],
 *  ['keyB', 'renamedB'],
 *  ['keyC', 'renamedC'],
 * ]
 * ```
 *
 * Produce this:
 *
 * ```ts
 * type Renamed = {
 *  renamedA: A,
 *  renamedB: B,
 *  renamedC: C,
 * }
 * ```
 *
 */
export type RenameUsingTuples<
  T extends Record<string, any>,
  RenameTuples extends readonly (readonly [string, string])[],
> = {
  [K in keyof T as K extends keyof ObjectFromEntries<RenameTuples>
    ? ObjectFromEntries<RenameTuples>[K]
    : K]: T[K];
};
