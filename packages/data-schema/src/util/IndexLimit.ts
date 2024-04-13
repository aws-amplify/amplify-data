/**
 * Create a tuple literal of numbers as index strings
 * The resulting literal will include 0 up to (N - 1)
 *
 * @typeParam Length - The number of literal values to include
 */
export type IndexLiteralTuple<
  Length extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends Length
  ? Result
  : IndexLiteralTuple<Length, [...Result, `${Result['length']}`]>;
