export type IndexLimitUnion<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : IndexLimitUnion<N, [...Result, `${Result['length']}`]>;
