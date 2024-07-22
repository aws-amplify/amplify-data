import type { UnwrapArray, Prettify } from '../util';
import type { Observable } from 'rxjs';

export type AuthMode =
  | 'apiKey'
  | 'iam'
  | 'identityPool'
  | 'oidc'
  | 'userPool'
  | 'lambda'
  | 'none';

/**
 * Custom headers that can be passed either to the client or to individual
 * model operations, either as a static object or a function that returns a
 * promise.
 */
export type CustomHeaders =
  | Record<string, string>
  | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);

/**
 * Request options that are passed to custom header functions.
 * `method` and `headers` are not included in custom header functions passed to
 * subscriptions.
 */
export type RequestOptions = {
  url: string;
  queryString: string;
  method?: string;
};

export type LazyLoader<Model, IsArray extends boolean> = (
  options?: IsArray extends true
    ? {
        authMode?: AuthMode;
        authToken?: string;
        limit?: number;
        nextToken?: string | null;
        headers?: CustomHeaders;
      }
    : {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
      },
) => IsArray extends true
  ? ListReturnValue<Prettify<NonNullable<Model>>>
  : SingularReturnValue<Prettify<Model>>;

export type ListReturnValue<T> = Promise<{
  data: Array<T>;
  nextToken?: string | null;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

// #region Interfaces copied from `graphql` package
// From https://github.com/graphql/graphql-js/blob/main/src/error/GraphQLError.ts

/**
 * See: https://spec.graphql.org/draft/#sec-Errors
 */
export interface GraphQLFormattedError {
  /**
   * A short, human-readable summary of the problem that **SHOULD NOT** change
   * from occurrence to occurrence of the problem, except for purposes of
   * localization.
   */
  readonly message: string;
  /**
   * The AppSync exception category. Indicates the source of the error.
   */
  readonly errorType: string;
  /**
   * Additional error metadata that can be surfaced via error handling resolver utils:
   * * JS - https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-error-js
   * * VTL - https://docs.aws.amazon.com/appsync/latest/devguide/utility-helpers-in-util.html#utility-helpers-in-error
   */
  readonly errorInfo: null | { [key: string]: unknown };
  /**
   * If an error can be associated to a particular point in the requested
   * GraphQL document, it should contain a list of locations.
   */
  readonly locations?: ReadonlyArray<SourceLocation>;
  /**
   * If an error can be associated to a particular field in the GraphQL result,
   * it _must_ contain an entry with the key `path` that details the path of
   * the response field which experienced the error. This allows clients to
   * identify whether a null result is intentional or caused by a runtime error.
   */
  readonly path?: ReadonlyArray<string | number>;
  /**
   * Reserved for implementors to extend the protocol however they see fit,
   * and hence there are no additional restrictions on its contents.
   */
  readonly extensions?: { [key: string]: unknown };
}

/**
 * Represents a location in a Source.
 */
export interface SourceLocation {
  readonly line: number;
  readonly column: number;
}

// #endregion

export type SingularReturnValue<T> = Promise<{
  data: T | null;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

/**
 * Generates custom selection set type with up to 6 levels of nested fields
 *
 * @returns string[] where each string is a field in the model
 * recurses over nested objects - such as relationships and custom types - generating a `field.*` type value to select all fields in that nested type,
 * as well as a dot-delimited set of fields for fine-grained selection of particular fields in the nested type (see example below)
 *
 * @example
 * ```ts
 * FlatModel = {
 *   id: string
 *   title: string
 *   comments: {
 *     id:: string
 *     content: string
 *   }[]
 * }
 *```
 *
 * ### Result
 * ```
 * 'id' | 'title' | 'comments.*' | 'comments.id' | 'comments.content'
 * ```
 *
 * @privateRemarks
 *
 * explicit recursion depth pattern ref: https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
 *
 * this pattern puts an upper bound on the levels of recursion in our mapped type
 *
 * it guards against infinite recursion when generating the selection set type for deeply-nested models
 * and especially for bi-directional relationships which are infinitely recursable by their nature
 *
 */
export type ModelPath<
  FlatModel extends Record<string, unknown>,
  // actual recursive Depth is 6, since we decrement down to 0
  Depth extends number = 5, // think of this as the initialization expr. in a for loop (e.g. `let depth = 5`)
  RecursionLoop extends number[] = [-1, 0, 1, 2, 3, 4],
  Field = keyof FlatModel,
> = {
  done: Field extends string ? `${Field}.*` : never;
  recur: Field extends string
    ? NonNullable<UnwrapArray<FlatModel[Field]>> extends Record<string, unknown>
      ?
          | `${Field}.${ModelPath<
              NonNullable<UnwrapArray<FlatModel[Field]>>,
              // this decrements `Depth` by 1 in each recursive call; it's equivalent to the update expr. afterthought in a for loop (e.g. `depth -= 1`)
              RecursionLoop[Depth]
            >}`
          | `${Field}.*`
      : `${Field}`
    : never;
  // this is equivalent to the condition expr. in a for loop (e.g. `depth !== -1`)
}[Depth extends -1 ? 'done' : 'recur'];

export type ModelSortDirection = 'ASC' | 'DESC';

export type ObservedReturnValue<T> = Observable<T>;

export type ObserveQueryReturnValue<T> = Observable<{
  items: T[];
  isSynced: boolean;
}>;

/**
 * SecondaryIndex index types and query methods
 */
export type SecondaryIndexIrShape = {
  queryField: string;
  pk: { [key: string]: string | number };
  sk: { [key: string]: string | number };
};
