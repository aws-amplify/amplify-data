/**
 * Not actually sure if/how customer can pass this through as variables yet.
 * Leaving it out for now:
 *
 * attributeType: "binary" | "binarySet" | "bool" | "list" | "map" | "number" | "numberSet" | "string" | "stringSet" | "_null"
 */

/**
 * Filters options that can be used on string-like fields.
 */

export type StringFilter<T extends string = string> = {
  attributeExists?: boolean;
  beginsWith?: string;
  between?: [string, string];
  contains?: string;
  eq?: T;
  ge?: string;
  gt?: string;
  le?: string;
  lt?: string;
  ne?: T;
  notContains?: string;
  size?: SizeFilter;
};

export type NumericFilter = {
  attributeExists?: boolean;
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

/**
 * Filter options that can be used on fields where size checks are supported.
 */
export type SizeFilter = {
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

export type BooleanFilters = {
  attributeExists?: boolean;
  eq?: boolean;
  ne?: boolean;
};

/**
 * A composite SK (in an identifier or secondaryIndex) resolves to this type for
 * list queries and index queries
 * 
 * @example
 * Given
 * ```ts
 * MyModel: a
  .model({
    pk: a.string().required(),
    sk1: a.string().required(),
    sk2: a.integer().required(),
  })
  .identifier(['pk', 'sk1', 'sk2']),
 * ``` 
 * Expected list options: 
 * ```ts
 * {
 *   pk?: string
 *   sk1Sk2?: ModelPrimaryCompositeKeyConditionInput
 * }
 * ```
 * Where ModelPrimaryCompositeKeyConditionInput resolves to:
 * ```ts
 * {
 *   eq: {sk1: string; sk2: number};
 *   le: {sk1: string; sk2: number};
 *   lt: {sk1: string; sk2: number};
 *   ge: {sk1: string; sk2: number};
 *   gt: {sk1: string; sk2: number};
 *   between: [ {sk1: string; sk2: number} ];
 *   beginsWith: {sk1: string; sk2: number};
 * }
 * ```
 * */
export type ModelPrimaryCompositeKeyInput<
  SkIr extends Record<string, string | number>,
> = {
  eq?: SkIr;
  le?: SkIr;
  lt?: SkIr;
  ge?: SkIr;
  gt?: SkIr;
  between?: [SkIr];
  beginsWith?: SkIr;
};
