// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  DeepReadOnlyObject,
  UnwrapArray,
  UnionToIntersection,
  Prettify,
  Equal,
  __modelMeta__,
  ExtractModelMeta,
  IsEmptyStringOrNever,
} from '@aws-amplify/data-schema-types';
import type { Observable } from 'rxjs';

// temporarily export symbols from `data-schema-types` because in case part of the
// problem with the runtime -> data-schema migration comes down to a mismatch
// around this symbol and it's extractor.
//
// before switching to declare these here, we need to prove it won't break any
// customer experiences. this *might* need to happen as a breaking change.
//
// export declare const __modelMeta__: unique symbol;
// export type ExtractModelMeta<T extends Record<any, any>> =
//   T[typeof __modelMeta__];

export {
  __modelMeta__,
  ExtractModelMeta,
} from '@aws-amplify/data-schema-types';

type Model = Record<string, any>;

// #region Return Value Mapped Types

/**
 * Currently this omits any object-type fields. Update this when we add custom types/enums.
 */
type NonRelationalFields<M extends Model> = {
  [Field in keyof M as UnwrapArray<M[Field]> extends Record<string, unknown>
    ? never
    : Field]: M[Field];
};

/**
 * Selection set-aware CRUDL operation return value type
 *
 * @returns model type as-is with default selection set; otherwise generates return type from custonm sel. set
 */
type ReturnValue<
  M extends Model,
  FlatModel extends Model,
  Paths extends ReadonlyArray<ModelPath<FlatModel>>,
> = Paths extends undefined | never[]
  ? M
  : CustomSelectionSetReturnValue<FlatModel, Paths[number]>;

/**
 * This mapped type traverses the SelectionSetReturnValue result and the original FlatModel, restoring array types
 * that were flattened in DeepPickFromPath
 *
 */
type RestoreArrays<Result, FlatModel> = {
  [K in keyof Result]: K extends keyof FlatModel
    ? FlatModel[K] extends Array<any>
      ? Array<RestoreArrays<Result[K], UnwrapArray<FlatModel[K]>>>
      : FlatModel[K] extends Record<string, any>
        ? RestoreArrays<Result[K], FlatModel[K]>
        : Result[K]
    : never;
};

/**
 * Generates flattened, readonly return type using specified custom sel. set
 */
type CustomSelectionSetReturnValue<
  FlatModel extends Model,
  Paths extends string,
> = Prettify<
  DeepReadOnlyObject<
    RestoreArrays<
      UnionToIntersection<DeepPickFromPath<FlatModel, Paths>>,
      FlatModel
    >
  >
>;

/**
 * Picks object properties that match provided dot-separated Path
 *
 * @typeParam FlatModel
 * @typeParam Path - string union of dot-separated paths
 *
 * @returns union of object slices
 * 
 * @example
 * ### Given
 * ```ts
 * FlatModel = {
    title: string;
    description?: string | null;
    comments: {
        content: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
    }[];
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  }

  Path = 'title' | 'comments.id' | 'comments.content'
 * ```
 * ### Returns
 * ```ts
 * { title: string } | { comments: { id: string} } | { comments: { content: string} }
 * ``` 
 * 
 * @privateRemarks
 * 
 * Intersections on arrays have unexpected behavior in TypeScript:
 * see: https://github.com/microsoft/TypeScript/issues/41874 and https://github.com/microsoft/TypeScript/issues/39693
 *
 * To work around this limitation, DeepPickFromPath flattens Arrays of Models (e.g. { comments: { id: string}[] } => { comments: { id: string} })
 * Arrays are then restored downstream in RestoreArrays
 */
type DeepPickFromPath<
  FlatModel extends Model,
  Path extends string,
> = FlatModel extends undefined
  ? DeepPickFromPath<NonNullable<FlatModel>, Path> | undefined
  : FlatModel extends null
    ? DeepPickFromPath<NonNullable<FlatModel>, Path> | null
    : FlatModel extends any[]
      ? DeepPickFromPath<UnwrapArray<FlatModel>, Path>
      : Path extends `${infer Head}.${infer Tail}`
        ? Head extends keyof FlatModel
          ? Tail extends '*'
            ? { [k in Head]: NonRelationalFields<UnwrapArray<FlatModel[Head]>> }
            : { [k in Head]: DeepPickFromPath<FlatModel[Head], Tail> }
          : never
        : Path extends keyof FlatModel
          ? { [K in Path]: FlatModel[Path] }
          : never;

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

/**
 * Flattens model instance type and unwraps async functions into resolved GraphQL shape
 * 
 * This type is used for generating the base shape for custom selection set input and its return value
 * Uses same pattern as above to limit recursion depth to maximum usable for selection set. 
 *
 * @example
 * ### Given
 * ```ts
 * Model = {
    title: string;
    comments: () => ListReturnValue<({
        content: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
    } | null | undefined)[]>;
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    description?: string | ... 1 more ... | undefined;
  }
 * ```
 * ### Returns
 * ```ts
 * {
    title: string;
    comments: {
        content: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
    }[];
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    description: string | null | undefined;
  }
 * 
 * ```
 */
// TODO: temporarily exported for troubleshooting
export type ResolvedModel<
  Model extends Record<string, unknown>,
  Depth extends number = 7,
  RecursionLoop extends number[] = [-1, 0, 1, 2, 3, 4, 5, 6],
> = {
  done: NonRelationalFields<Model>;
  recur: {
    [Field in keyof Model]: Model[Field] extends (
      ...args: any
    ) => ListReturnValue<infer M>
      ? NonNullable<M> extends Record<string, any>
        ? ResolvedModel<NonNullable<M>, RecursionLoop[Depth]>[]
        : never
      : Model[Field] extends (...args: any) => SingularReturnValue<infer M>
        ? NonNullable<M> extends Record<string, any>
          ? ResolvedModel<NonNullable<M>, RecursionLoop[Depth]>
          : never
        : Model[Field];
  };
}[Depth extends -1 ? 'done' : 'recur'];

export type SelectionSet<
  Model extends Record<string, unknown>,
  Path extends ReadonlyArray<ModelPath<FlatModel>>,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = CustomSelectionSetReturnValue<FlatModel, Path[number]>;
// #endregion

// #region Input mapped types
export type ModelIdentifier<Model extends Record<any, any>> = Prettify<
  Record<Model['identifier'] & string, string>
>;

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

// Excludes readonly fields from Record type
type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

/**
 * All required fields and relational fields, exclude readonly fields
 */
type MutationInput<
  Fields,
  WritableFields = Pick<Fields, WritableKeys<Fields>>,
> = {
  [Prop in keyof WritableFields as WritableFields[Prop] extends (
    ...args: any
  ) => any
    ? never
    : Prop]: WritableFields[Prop];
};

/**
 * All identifiers and fields used to create a model
 */
type CreateModelInput<
  Model extends Record<string, unknown>,
  ModelMeta extends Record<string, unknown>,
> =
  Equal<ModelIdentifier<ModelMeta>, { id: string }> extends true
    ? Partial<ModelIdentifier<ModelMeta>> & Omit<MutationInput<Model>, 'id'>
    : MutationInput<Model>;

// #endregion

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
  data: T;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

export type ListReturnValue<T> = Promise<{
  data: Array<T>;
  nextToken?: string | null;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

export type ObservedReturnValue<T> = Observable<T>;

export type ObserveQueryReturnValue<T> = Observable<{
  items: T[];
  isSynced: boolean;
}>;

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

export type AuthMode =
  | 'apiKey'
  | 'iam'
  | 'oidc'
  | 'userPool'
  | 'lambda'
  | 'none';

type LogicalFilters<Model extends Record<any, any>> = {
  and?: ModelFilter<Model> | ModelFilter<Model>[];
  or?: ModelFilter<Model> | ModelFilter<Model>[];
  not?: ModelFilter<Model>;
};

/**
 * Filter options that can be used on fields where size checks are supported.
 */
type SizeFilter = {
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

/**
 * Not actually sure if/how customer can pass this through as variables yet.
 * Leaving it out for now:
 *
 * attributeType: "binary" | "binarySet" | "bool" | "list" | "map" | "number" | "numberSet" | "string" | "stringSet" | "_null"
 */

/**
 * Filters options that can be used on string-like fields.
 */
type StringFilter = {
  attributeExists?: boolean;
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
  size?: SizeFilter;
};

type NumericFilter = {
  attributeExists?: boolean;
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

type BooleanFilters = {
  attributeExists?: boolean;
  eq?: boolean;
  ne?: boolean;
};

type ModelFilter<Model extends Record<any, any>> = LogicalFilters<Model> & {
  [K in keyof Model as Model[K] extends LazyLoader<any, any>
    ? never
    : K]?: Model[K] extends boolean
    ? BooleanFilters
    : Model[K] extends number
      ? NumericFilter
      : StringFilter;
};

export type ModelSortDirection = 'ASC' | 'DESC';

type ModelMetaShape = {
  secondaryIndexes: SecondaryIndexIrShape[];
  identifier: string;
};

// TODO: remove export. added for debugging.
export type ModelTypesClient<
  ModelName extends string,
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], ModelName, Model> & {
  create: (
    model: Prettify<CreateModelInput<Model, ModelMeta>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  update: (
    model: Prettify<ModelIdentifier<ModelMeta> & Partial<MutationInput<Model>>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  delete: (
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
  list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    options?: Partial<ModelIdentifier<ModelMeta>> & {
      filter?: ModelFilter<Model>;
      sortDirection?: ModelSortDirection;
      limit?: number;
      nextToken?: string | null;
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
  onCreate<
    SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[],
  >(options?: {
    filter?: ModelFilter<Model>;
    selectionSet?: SelectionSet;
    authMode?: AuthMode;
    authToken?: string;
    headers?: CustomHeaders;
  }): ObservedReturnValue<
    Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
  >;
  onUpdate<
    SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[],
  >(options?: {
    filter?: ModelFilter<Model>;
    selectionSet?: SelectionSet;
    authMode?: AuthMode;
    authToken?: string;
    headers?: CustomHeaders;
  }): ObservedReturnValue<
    Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
  >;
  onDelete<
    SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[],
  >(options?: {
    filter?: ModelFilter<Model>;
    selectionSet?: SelectionSet;
    authMode?: AuthMode;
    authToken?: string;
    headers?: CustomHeaders;
  }): ObservedReturnValue<
    Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
  >;
  observeQuery<
    SelectionSet extends ModelPath<FlatModel>[] = never[],
  >(options?: {
    filter?: ModelFilter<Model>;
    selectionSet?: SelectionSet;
    authMode?: AuthMode;
    authToken?: string;
  }): ObserveQueryReturnValue<
    Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
  >;
};

type ModelTypesSSRCookies<
  ModelName extends string,
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], ModelName, Model> & {
  create: (
    model: Prettify<CreateModelInput<Model, ModelMeta>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  update: (
    model: Prettify<ModelIdentifier<ModelMeta> & Partial<MutationInput<Model>>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  delete: (
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
  list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    options?: Partial<ModelIdentifier<ModelMeta>> & {
      filter?: ModelFilter<Model>;
      sortDirection?: ModelSortDirection;
      limit?: number;
      nextToken?: string | null;
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

type ModelTypesSSRRequest<
  ModelName extends string,
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], ModelName, Model> & {
  create: (
    // TODO: actual type
    contextSpec: any,
    model: Prettify<CreateModelInput<Model, ModelMeta>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  update: (
    contextSpec: any,
    model: Prettify<ModelIdentifier<ModelMeta> & Partial<MutationInput<Model>>>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  delete: (
    contextSpec: any,
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => SingularReturnValue<Model>;
  get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    contextSpec: any,
    identifier: ModelIdentifier<ModelMeta>,
    options?: {
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
  list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(
    contextSpec: any,
    options?: Partial<ModelIdentifier<ModelMeta>> & {
      filter?: ModelFilter<Model>;
      sortDirection?: ModelSortDirection;
      limit?: number;
      nextToken?: string | null;
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

type ContextType = 'CLIENT' | 'COOKIES' | 'REQUEST';

export type ModelTypes<
  Schema extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = {
  [ModelName in Exclude<
    keyof Schema,
    keyof CustomOperations<
      Schema,
      'Mutation' | 'Query' | 'Subscription',
      Context,
      ModelMeta
    >
  >]: ModelName extends string
    ? Schema[ModelName] extends Record<string, unknown>
      ? Context extends 'CLIENT'
        ? ModelTypesClient<ModelName, Schema[ModelName], ModelMeta[ModelName]>
        : Context extends 'COOKIES'
          ? ModelTypesSSRCookies<
              ModelName,
              Schema[ModelName],
              ModelMeta[ModelName]
            >
          : Context extends 'REQUEST'
            ? ModelTypesSSRRequest<
                ModelName,
                Schema[ModelName],
                ModelMeta[ModelName]
              >
            : never
      : never
    : never;
};

export type CustomQueries<
  Schema extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = CustomOperations<Schema, 'Query', Context, ModelMeta>;

export type CustomMutations<
  Schema extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = CustomOperations<Schema, 'Mutation', Context, ModelMeta>;

export type CustomSubscriptions<
  Schema extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = CustomOperations<Schema, 'Subscription', Context, ModelMeta>;

type CustomOperationMethodOptions = {
  // selectionSet?: SelectionSet;
  authMode?: AuthMode;
  authToken?: string;
  headers?: CustomHeaders;
};

/**
 * Generates Custom Operations function params based on whether .arguments() were specified in the schema builder
 */
type CustomOperationFnParams<Args extends Record<string, unknown> | never> = [
  Args,
] extends [never]
  ? [CustomOperationMethodOptions?]
  : [Args, CustomOperationMethodOptions?];

export type CustomOperations<
  Schema extends Record<any, any>,
  OperationType extends 'Query' | 'Mutation' | 'Subscription',
  Context extends ContextType = 'CLIENT',
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = {
  [OpName in keyof ModelMeta['customOperations'] as ModelMeta['customOperations'][OpName]['typeName'] extends OperationType
    ? OpName
    : never]: {
    CLIENT: (
      ...params: CustomOperationFnParams<
        ModelMeta['customOperations'][OpName]['arguments']
      >
    ) => // we only generate subscriptions on the clientside; so this isn't applied to COOKIES | REQUEST
    ModelMeta['customOperations'][OpName]['typeName'] extends 'Subscription'
      ? ObservedReturnValue<ModelMeta['customOperations'][OpName]['returnType']>
      : SingularReturnValue<
          ModelMeta['customOperations'][OpName]['returnType']
        >;
    COOKIES: (
      ...params: CustomOperationFnParams<
        ModelMeta['customOperations'][OpName]['arguments']
      >
    ) => SingularReturnValue<
      ModelMeta['customOperations'][OpName]['returnType']
    >;
    REQUEST: (
      contextSpec: any,
      ...params: CustomOperationFnParams<
        ModelMeta['customOperations'][OpName]['arguments']
      >
    ) => SingularReturnValue<
      ModelMeta['customOperations'][OpName]['returnType']
    >;
  }[Context];
};

/**
 * The utility type that is used to infer the type (interface) of the generated
 * `client.enums` property.
 *
 * @example
 * // The schema:
 * {
 *   TodoStatus: a.enum(['Planned' | 'InProgress' | 'Completed']),
 * }
 *
 * // The inferred interface of the `client.enums`:
 * {
 *   TodoStatus: {
 *     values: () => Array<'Planned' | 'InProgress' | 'Completed'>;
 *   }
 * }
 */
export type EnumTypes<
  Schema extends Record<any, any>,
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = {
  [EnumName in keyof ModelMeta['enums']]: {
    values: () => Array<ModelMeta['enums'][EnumName]>;
  };
};

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

/**
 * Custom headers that can be passed either to the client or to individual
 * model operations, either as a static object or a function that returns a
 * promise.
 */
export type CustomHeaders =
  | Record<string, string>
  | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);

/**
 * SecondaryIndex index types and query methods
 */
export type SecondaryIndexIrShape = {
  defaultQueryFieldSuffix: string;
  queryField: string;
  pk: { [key: string]: string | number };
  sk: { [key: string]: string | number };
};

type IndexQueryMethodsFromIR<
  SecondaryIdxTuple extends SecondaryIndexIrShape[],
  ModelName extends string,
  Model extends Record<string, unknown>,
  Res = unknown, // defaulting `unknown` because it gets absorbed in an intersection, e.g. `{a: 1} & unknown` => `{a: 1}`
> = SecondaryIdxTuple extends [
  infer A extends SecondaryIndexIrShape,
  ...infer B extends SecondaryIndexIrShape[],
]
  ? IndexQueryMethodsFromIR<
      B,
      ModelName,
      Model,
      IndexQueryMethodSignature<A, ModelName, Model> & Res
    >
  : Res;

type IndexQueryMethodSignature<
  Idx extends SecondaryIndexIrShape,
  ModelName extends string,
  Model extends Record<string, unknown>,
> = Record<
  IsEmptyStringOrNever<Idx['queryField']> extends false
    ? Idx['queryField']
    : `list${ModelName}By${Idx['defaultQueryFieldSuffix']}`,
  <
    FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
    SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[],
  >(
    input: Idx['pk'] & {
      [SKField in keyof Idx['sk']]+?: string extends Idx['sk'][SKField]
        ? StringFilter
        : NumericFilter;
    },
    options?: {
      filter?: ModelFilter<Model>;
      sortDirection?: ModelSortDirection;
      limit?: number;
      nextToken?: string | null;
      selectionSet?: SelectionSet;
      authMode?: AuthMode;
      authToken?: string;
      headers?: CustomHeaders;
    },
  ) => ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>
>;

type FilteredKeys<T> = {
  [P in keyof T]: T[P] extends never ? never : P;
}[keyof T];

type ExcludeNeverFields<O> = {
  [K in FilteredKeys<O>]: O[K];
};

export type ClientExtensions<T extends Record<any, any> = never> =
  ExcludeNeverFields<{
    models: ModelTypes<T, 'CLIENT'>;
    enums: EnumTypes<T>;
    queries: CustomQueries<T, 'CLIENT'>;
    mutations: CustomMutations<T, 'CLIENT'>;
    subscriptions: CustomSubscriptions<T, 'CLIENT'>;
  }>;

export type ClientExtensionsSSRRequest<T extends Record<any, any> = never> =
  ExcludeNeverFields<{
    models: ModelTypes<T, 'REQUEST'>;
    enums: EnumTypes<T>;
    queries: CustomQueries<T, 'REQUEST'>;
    mutations: CustomMutations<T, 'REQUEST'>;
  }>;

export type ClientExtensionsSSRCookies<T extends Record<any, any> = never> =
  ExcludeNeverFields<{
    models: ModelTypes<T, 'COOKIES'>;
    enums: EnumTypes<T>;
    queries: CustomQueries<T, 'COOKIES'>;
    mutations: CustomMutations<T, 'COOKIES'>;
  }>;
