/**
 * Transform into the type intersection of all items in a given tuple
 *
 * @typeParam T - The tuple of types to spread into a type intersection
 */
export type SpreadTuple<T extends readonly any[]> = T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
    ? F & SpreadTuple<R>
    : never;
