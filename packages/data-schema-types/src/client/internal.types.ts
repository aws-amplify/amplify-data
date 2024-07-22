import type {
  DeepReadOnlyObject,
  UnwrapArray,
  UnionToIntersection,
  Prettify,
  Equal,
} from '../util';
import {
  AuthMode,
  CustomHeaders,
  LazyLoader,
  ListReturnValue,
  ModelPath,
  ModelSortDirection,
  ObservedReturnValue,
  ObserveQueryReturnValue,
  SecondaryIndexIrShape,
  SingularReturnValue,
} from './shared.types';

export type Model = Record<string, any>;

/**
 * Currently this omits any object-type fields. Update this when we add custom types/enums.
 */
export type NonRelationalFields<M extends Model> = {
  [Field in keyof M as UnwrapArray<M[Field]> extends Record<string, unknown>
    ? never
    : Field]: M[Field];
};

/**
 * Selection set-aware CRUDL operation return value type
 *
 * @returns model type as-is with default selection set; otherwise generates return type from custonm sel. set
 */
export type ReturnValue<
  M extends Model,
  FlatModel extends Model,
  Paths extends ReadonlyArray<ModelPath<FlatModel>>,
> = Paths extends never[]
  ? M
  : CustomSelectionSetReturnValue<FlatModel, Paths[number]>;

/**
 * This mapped type traverses the SelectionSetReturnValue result and the original FlatModel, restoring array types
 * that were flattened in DeepPickFromPath
 *
 */
export type RestoreArrays<Result, FlatModel> = {
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
export type CustomSelectionSetReturnValue<
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
export type DeepPickFromPath<
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

// #region Input mapped types
export type ModelIdentifier<Model extends Record<any, any>> = Prettify<
  Record<Model['identifier'] & string, string>
>;

export type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

// Excludes readonly fields from Record type
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

/**
 * All required fields and relational fields, exclude readonly fields
 */
export type MutationInput<
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
export type CreateModelInput<
  Model extends Record<string, unknown>,
  ModelMeta extends Record<string, unknown>,
> =
  Equal<ModelIdentifier<ModelMeta>, { id: string }> extends true
    ? Partial<ModelIdentifier<ModelMeta>> & Omit<MutationInput<Model>, 'id'>
    : MutationInput<Model>;

// #endregion

// #region Interfaces copied from `graphql` package
// From https://github.com/graphql/graphql-js/blob/main/src/error/GraphQLError.ts

export type LogicalFilters<Model extends Record<any, any>> = {
  and?: ModelFilter<Model> | ModelFilter<Model>[];
  or?: ModelFilter<Model> | ModelFilter<Model>[];
  not?: ModelFilter<Model>;
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
 * Not actually sure if/how customer can pass this through as variables yet.
 * Leaving it out for now:
 *
 * attributeType: "binary" | "binarySet" | "bool" | "list" | "map" | "number" | "numberSet" | "string" | "stringSet" | "_null"
 */

/**
 * Filters options that can be used on string-like fields.
 */
export type StringFilter = {
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

export type ModelFilter<Model extends Record<any, any>> =
  LogicalFilters<Model> & {
    [K in keyof Model as Model[K] extends LazyLoader<any, any>
      ? never
      : K]?: Model[K] extends boolean
      ? BooleanFilters
      : Model[K] extends number
        ? NumericFilter
        : StringFilter;
  };

export type ModelMetaShape = {
  secondaryIndexes: SecondaryIndexIrShape[];
  identifier: string[];
};

export type ModelTypesClient<
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
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

export type ModelTypesSSRCookies<
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
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

export type ModelTypesSSRRequest<
  Model extends Record<string, unknown>,
  ModelMeta extends ModelMetaShape,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
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

export type ContextType = 'CLIENT' | 'COOKIES' | 'REQUEST';

export type CustomOperationMethodOptions = {
  // selectionSet?: SelectionSet;
  authMode?: AuthMode;
  authToken?: string;
  headers?: CustomHeaders;
};

/**
 * Generates Custom Operations function params based on whether .arguments() were specified in the schema builder
 */
export type CustomOperationFnParams<
  Args extends Record<string, unknown> | never,
> = [Args] extends [never]
  ? [CustomOperationMethodOptions?]
  : [Args, CustomOperationMethodOptions?];

export type IndexQueryMethodsFromIR<
  SecondaryIdxTuple extends SecondaryIndexIrShape[],
  Model extends Record<string, unknown>,
  Res = unknown, // defaulting `unknown` because it gets absorbed in an intersection, e.g. `{a: 1} & unknown` => `{a: 1}`
> = SecondaryIdxTuple extends [
  infer A extends SecondaryIndexIrShape,
  ...infer B extends SecondaryIndexIrShape[],
]
  ? IndexQueryMethodsFromIR<B, Model, IndexQueryMethodSignature<A, Model> & Res>
  : Res;

export type IndexQueryMethodSignature<
  Idx extends SecondaryIndexIrShape,
  Model extends Record<string, unknown>,
> = {
  [K in Idx['queryField'] & string]: <
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
  ) => ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};
