/**
 * Create a type literal of numbers as index strings
 * The resulting literal will include 0 up to (N - 1)
 *
 * @typeParam N - The number of literal values to include
 */
export type IndexLimitUnion<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : IndexLimitUnion<N, [...Result, `${Result['length']}`]>;
