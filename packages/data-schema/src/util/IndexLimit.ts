export type IndexLimit<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : IndexLimit<N, [...Result, `${Result['length']}`]>;
