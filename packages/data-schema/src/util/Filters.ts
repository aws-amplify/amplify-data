/**
 * Not actually sure if/how customer can pass this through as variables yet.
 * Leaving it out for now:
 *
 * attributeType: "binary" | "binarySet" | "bool" | "list" | "map" | "number" | "numberSet" | "string" | "stringSet" | "_null"
 */

/**
 * CRUDL Filters
 *
 * reference: https://github.com/aws-amplify/amplify-category-api/blob/a655e71115e0e8e3597b4c2ef1b2940a79fdcaa1/packages/amplify-graphql-model-transformer/src/definitions.ts
 */

// Filter options that can be used on string-like fields (string, ID, AWSDateTime, etc.).
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

// Filter options that can be used on numeric fields (int, float, AWSTimestamp).
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

export type BooleanFilters = {
  attributeExists?: boolean;
  eq?: boolean;
  ne?: boolean;
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

/**
 * Subscription Filters
 *
 * reference: https://github.com/aws-amplify/amplify-category-api/blob/a655e71115e0e8e3597b4c2ef1b2940a79fdcaa1/packages/amplify-graphql-model-transformer/src/definitions.ts
 */
export type SubscriptionStringFilter = {
  beginsWith?: string;
  between?: [string, string];
  contains?: string;
  eq?: string;
  ge?: string;
  gt?: string;
  le?: string;
  lt?: string;
  ne?: string;
  notContains?: string;
  in?: string[];
  notIn?: string[];
};

export type SubscriptionNumericFilter = {
  between?: [number, number];
  in?: number[];
  notIn?: number[];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

export type SubscriptionBooleanFilters = {
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
 *   between: [ {sk1: string; sk2: number}, {sk1: string; sk2: number} ];
 *   beginsWith: {sk1: string; sk2: number};
 * }
 * ```
 * 
 * reference: https://github.com/aws-amplify/amplify-category-api/blob/a655e71115e0e8e3597b4c2ef1b2940a79fdcaa1/packages/graphql-transformer-common/src/dynamodbUtils.ts#L32-L36
 * 
 * */
export type ModelPrimaryCompositeKeyInput<
  SkIr extends Record<string, string | number>,
> = {
  eq?: SkIr;
  le?: SkIr;
  lt?: SkIr;
  ge?: SkIr;
  gt?: SkIr;
  between?: [SkIr, SkIr];
  beginsWith?: SkIr;
};
