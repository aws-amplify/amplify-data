import { KindaPretty } from './KindaPretty';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';

/**
 * Turns this:
 *
 * ```ts
 * type E = [
 *  ['keyA', 'valueA'],
 *  ['keyB', 'valueB'],
 *  ['keyC', 'valueC'],
 * ]
 * ```
 *
 * Into this:
 *
 * ```ts
 * type R = [
 *  Record<"keyA", "valueA">,
 *  Record<"keyB", "valueB">,
 *  Record<"keyC", "valueC">,
 * ]
 * ```
 */
type EntriesToRecordTuple<T> = {
  [K in keyof T]: T[K] extends readonly [
    infer innerK extends string,
    infer innerT,
  ]
    ? Record<innerK, innerT>
    : T[K];
};

/**
 * Turns this:
 *
 * ```ts
 * type E = [
 *  ['keyA', 'valueA'],
 *  ['keyB', 'valueB'],
 *  ['keyC', 'valueC'],
 * ]
 * ```
 *
 * Into this:
 *
 * ```ts
 * type O = {
 *  keyA: "valueA",
 *  keyB: "valueB",
 *  keyC: "valueC",
 * }
 * ```
 */
export type ObjectFromEntries<T> =
  T extends ReadonlyArray<any>
    ? KindaPretty<UnionToIntersection<EntriesToRecordTuple<T>[number]>>
    : never;
