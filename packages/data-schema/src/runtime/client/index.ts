// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  type DeepReadOnlyObject,
  type UnwrapArray,
  type UnionToIntersection,
  type Prettify,
  __modelMeta__,
} from '@aws-amplify/data-schema-types';
import type { Observable } from 'rxjs';
import type { ConversationRoute } from '../../ai/ConversationType';
import type {
  ClientSchemaByEntityType,
  ClientSchemaByEntityTypeBaseShape,
} from '../../ClientSchema';
import type { ExtractNestedTypes } from '../../ClientSchema/utilities/';
import type {
  Select,
  StringFilter,
  NumericFilter,
  BooleanFilters,
  SubscriptionStringFilter,
  SubscriptionNumericFilter,
  SubscriptionBooleanFilters,
} from '../../util';
import { AmplifyServer } from '../bridge-types';

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
type NonRelationshipFields<M extends Model> = {
  [Field in keyof M as UnwrapArray<M[Field]> extends Record<string, unknown>
    ? never
    : Field]: M[Field];
};

type WithOptionalsAsNullishOnly<T> =
  T extends Array<infer ArrayType>
    ? Array<WithOptionalsAsNullishOnly<ArrayType>>
    : T extends (...args: any) => any
      ? T
      : T extends object
        ? {
            [K in keyof T]-?: WithOptionalsAsNullishOnly<T[K]>;
          }
        : Exclude<T, undefined>;

/**
 * Selection set-aware CRUDL operation return value type
 *
 * @returns model type with default selection set; otherwise generates return type from custom sel. set. Optionality is removed from both return types.
 */
type ReturnValue<
  M extends ClientSchemaByEntityTypeBaseShape['models'][string],
  FlatModel extends Model,
  Paths extends ReadonlyArray<ModelPath<FlatModel>>,
> = Paths extends undefined | never[]
  ? WithOptionalsAsNullishOnly<M['type']>
  : WithOptionalsAsNullishOnly<
      CustomSelectionSetReturnValue<FlatModel, Paths[number]>
    >;

/**
 * This mapped type traverses the SelectionSetReturnValue result and the original FlatModel, restoring array types
 * that were flattened in DeepPickFromPath
 *
 * @typeParam Result - this is the result of applying the selection set path to FlatModel; return type of UnionToIntersection<DeepPickFromPath<FlatModel, Paths>>
 * @typeParam FlatModel - the reference model shape; return type of ResolvedModel<Model>
 *
 * Note: we wrap `Result` and `FlatModel` in NonNullable, because recursive invocations of this mapped type
 * can result in the type arguments containing `{} | null | undefined` which breaks indexed access, e.g. Result[K]
 *
 * Using NonNullable<> directly inside the mapped type is significantly more performant here than attempting to pre-compute in the type params,
 * e.g., `type RestoreArrays<Result, FlatModel, NonNullableResult = NonNullable<Result>, NonNullableFlatModel = NonNullable<FlatModel>> = {...}`
 */
type RestoreArrays<Result, FlatModel> = {
  [K in keyof NonNullable<Result>]: K extends keyof NonNullable<FlatModel>
    ? Array<any> extends NonNullable<FlatModel>[K]
      ? HandleArrayNullability<
          NonNullable<Result>[K],
          NonNullable<FlatModel>[K]
        >
      : NonNullable<FlatModel>[K] extends Record<string, any>
        ? RestoreArrays<NonNullable<Result>[K], NonNullable<FlatModel>[K]>
        : NonNullable<Result>[K]
    : never;
};

/**
 * This mapped type gets called by RestoreArrays<T, K> and it restores the expected
 * nullability in array fields (e.g. nullable vs. required value & nullable vs. required array)
 */
type HandleArrayNullability<Result, FlatModel> =
  Array<any> extends Result
    ? // If Result is already an array, return it as is.
      Result
    : NonNullable<FlatModel> extends Array<infer InnerValue>
      ? // is the array nullable?
        null extends FlatModel
        ? // is the value nullable?
          null extends InnerValue
          ? // value and array are nullable - a.ref('SomeType').array()
            Array<RestoreArrays<Result, UnwrapArray<FlatModel>> | null> | null
          : // value required; array nullable - a.ref('SomeType').required().array()
            Array<RestoreArrays<Result, UnwrapArray<FlatModel>>> | null
        : null extends InnerValue
          ? // value nullable; array required  - a.ref('SomeType').array().required()
            Array<RestoreArrays<Result, UnwrapArray<FlatModel>> | null>
          : // value required; array required - a.ref('SomeType').required().array().required()
            Array<RestoreArrays<Result, UnwrapArray<FlatModel>>>
      : never;

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
            ? {
                [k in Head]: FlatModel[Head] extends Record<string, unknown>
                  ? NonRelationshipFields<FlattenArrays<FlatModel[Head]>>
                  : NonRelationshipFields<UnwrapArray<FlatModel[Head]>>;
              }
            : { [k in Head]: DeepPickFromPath<FlatModel[Head], Tail> }
          : never
        : Path extends keyof FlatModel
          ? { [K in Path]: FlatModel[Path] }
          : never;

/**
 * This mapped type gets called by DeepPickFromPath<FlatModel, Path> when user uses selection
 * set on a query to a many-to-many relationship join table. It flattens the Arrays of Models referenced in the join table.
 *
 * (e.g. { customer: { orders: Order[]} } => { customer: { orders: Order} })
 */
type FlattenArrays<T> = {
  [K in keyof T]: UnwrapArray<T[K]>;
};

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
type ModelPathInner<
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
          | `${Field}.${ModelPathInner<
              NonNullable<UnwrapArray<FlatModel[Field]>>,
              // this decrements `Depth` by 1 in each recursive call; it's equivalent to the update expr. afterthought in a for loop (e.g. `depth -= 1`)
              RecursionLoop[Depth]
            >}`
          | `${Field}.*`
      : `${Field}`
    : never;
  // this is equivalent to the condition expr. in a for loop (e.g. `depth !== -1`)
}[Depth extends -1 ? 'done' : 'recur'];

export type ModelPath<FlatModel extends Record<string, unknown>> =
  | (string & Readonly<unknown>)
  | ModelPathInner<FlatModel>;

export type SelectionSet<
  Model,
  Path extends ReadonlyArray<ModelPath<FlatModel>>,
  FlatModel extends Record<
    string,
    unknown
    // Remove conditional in next major version
  > = Model extends ClientSchemaByEntityTypeBaseShape['models'][string]
    ? Model['__meta']['flatModel']
    : Record<string, any>,
> =
  // Remove conditional in next major version
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string]
    ? WithOptionalsAsNullishOnly<
        CustomSelectionSetReturnValue<FlatModel, Path[number]>
      >
    : any;
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
  data: T | null;
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

export type LazyLoader<T, IsArray extends boolean> = (
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
  ? ListReturnValue<Prettify<NonNullable<T>>>
  : SingularReturnValue<Prettify<T>>;

export type AuthMode =
  | 'apiKey'
  | 'iam'
  | 'identityPool'
  | 'oidc'
  | 'userPool'
  | 'lambda'
  | 'none';

type LogicalFilters<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
> = {
  and?: ModelFilter<Model> | ModelFilter<Model>[];
  or?: ModelFilter<Model> | ModelFilter<Model>[];
  not?: ModelFilter<Model>;
};

type ModelFilter<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
> = LogicalFilters<Model> & {
  [K in keyof Model['type'] as Model['type'][K] extends LazyLoader<any, any>
    ? never
    : K]?: boolean extends Model['type'][K]
    ? BooleanFilters
    : number extends Model['type'][K]
      ? NumericFilter
      : StringFilter;
};

type LogicalSubscriptionFilters<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
> = {
  and?: ModelSubscriptionFilter<Model> | ModelSubscriptionFilter<Model>[];
  or?: ModelSubscriptionFilter<Model> | ModelSubscriptionFilter<Model>[];
  not?: ModelSubscriptionFilter<Model>;
};

type ModelSubscriptionFilter<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
> = LogicalSubscriptionFilters<Model> & {
  [K in keyof Model['type'] as Model['type'][K] extends LazyLoader<any, any>
    ? never
    : K]?: boolean extends Model['type'][K]
    ? SubscriptionBooleanFilters
    : number extends Model['type'][K]
      ? SubscriptionNumericFilter
      : SubscriptionStringFilter;
};

export type ModelSortDirection = 'ASC' | 'DESC';

type ListCpkOptions<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
> = unknown extends Model['__meta']['listOptionsPkParams']
  ? unknown
  : Model['__meta']['listOptionsPkParams'] & {
      sortDirection?: ModelSortDirection;
    };

interface ClientSecondaryIndexField {
  input: object;
}

type IndexQueryMethods<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
  Context extends ContextType = 'CLIENT',
> = {
  [K in keyof Select<
    Model['secondaryIndexes'],
    ClientSecondaryIndexField
  >]: IndexQueryMethod<
    Model,
    Select<Model['secondaryIndexes'], ClientSecondaryIndexField>[K],
    Context
  >;
};

type IndexQueryMethod<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
  Method extends ClientSecondaryIndexField,
  Context extends ContextType = 'CLIENT',
  FlatModel extends Record<string, unknown> = Model['__meta']['flatModel'],
> = Context extends 'CLIENT' | 'COOKIES'
  ? <SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
      input: Method['input'],
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
  : <SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
      contextSpec: AmplifyServer.ContextSpec,
      input: Method['input'],
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

type ModelTypesClient<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
  FlatModel extends Record<string, unknown> = Model['__meta']['flatModel'],
> = IndexQueryMethods<Model> &
  // Omit any disabled operations
  Omit<
    {
      create<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        model: Model['createType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      update<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        model: Model['updateType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      delete<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        identifier: Model['deleteType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        identifier: Model['identifier'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        options?: ListCpkOptions<Model> & {
          filter?: ModelFilter<Model>;
          limit?: number;
          nextToken?: string | null;
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
      onCreate<
        SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>,
      >(options?: {
        filter?: ModelSubscriptionFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
      }): ObservedReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      onUpdate<
        SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>,
      >(options?: {
        filter?: ModelSubscriptionFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
      }): ObservedReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      onDelete<
        SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>,
      >(options?: {
        filter?: ModelSubscriptionFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
      }): ObservedReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      observeQuery<SelectionSet extends ModelPath<FlatModel>[]>(options?: {
        filter?: ModelFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
      }): ObserveQueryReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
    },
    keyof Model['__meta']['disabledOperations']
  >;

type ModelTypesSSRCookies<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
  FlatModel extends Record<string, unknown> = Model['__meta']['flatModel'],
> = IndexQueryMethods<Model> &
  // Omit any disabled operations
  Omit<
    {
      create<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        model: Model['createType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      update<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        model: Model['updateType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      delete<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        identifier: Model['deleteType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        identifier: Model['identifier'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        options?: ListCpkOptions<Model> & {
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
    },
    keyof Model['__meta']['disabledOperations']
  >;

type ModelTypesSSRRequest<
  Model extends ClientSchemaByEntityTypeBaseShape['models'][string],
  FlatModel extends Record<string, unknown> = Model['__meta']['flatModel'],
> = IndexQueryMethods<Model, 'REQUEST'> &
  // Omit any disabled operations
  Omit<
    {
      create<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        contextSpec: AmplifyServer.ContextSpec,
        model: Model['createType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      update<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        contextSpec: AmplifyServer.ContextSpec,
        model: Model['updateType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      delete<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        contextSpec: AmplifyServer.ContextSpec,
        identifier: Model['deleteType'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      get<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        contextSpec: AmplifyServer.ContextSpec,
        identifier: Model['identifier'],
        options?: {
          selectionSet?: SelectionSet;
          authMode?: AuthMode;
          authToken?: string;
          headers?: CustomHeaders;
        },
      ): SingularReturnValue<
        Prettify<ReturnValue<Model, FlatModel, SelectionSet>>
      >;
      list<SelectionSet extends ReadonlyArray<ModelPath<FlatModel>>>(
        contextSpec: AmplifyServer.ContextSpec,
        options?: ListCpkOptions<Model> & {
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
    },
    keyof Model['__meta']['disabledOperations']
  >;

type ContextType = 'CLIENT' | 'COOKIES' | 'REQUEST';

export type ModelTypes<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = {
  [ModelName in keyof Schema['models']]: Context extends 'CLIENT'
    ? ModelTypesClient<Schema['models'][ModelName]>
    : Context extends 'COOKIES'
      ? ModelTypesSSRCookies<Schema['models'][ModelName]>
      : Context extends 'REQUEST'
        ? ModelTypesSSRRequest<Schema['models'][ModelName]>
        : never;
};

export type CustomQueries<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = CustomOperations<Schema['queries'], Context>;

export type CustomMutations<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = CustomOperations<Schema['mutations'], Context>;

export type CustomSubscriptions<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = CustomOperations<Schema['subscriptions'], Context>;

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
  OperationDefs extends ClientSchemaByEntityTypeBaseShape[
    | 'queries'
    | 'mutations'
    | 'subscriptions'
    | 'generations'],
  Context extends ContextType = 'CLIENT',
> = {
  [OpName in keyof OperationDefs]: {
    CLIENT: (
      ...params: CustomOperationFnParams<OperationDefs[OpName]['args']>
    ) => // we only generate subscriptions on the clientside; so this isn't applied to COOKIES | REQUEST
    OperationDefs[OpName]['operationType'] extends 'Subscription'
      ? ObservedReturnValue<OperationDefs[OpName]['type']>
      : SingularReturnValue<OperationDefs[OpName]['type']>;
    COOKIES: (
      ...params: CustomOperationFnParams<OperationDefs[OpName]['args']>
    ) => SingularReturnValue<OperationDefs[OpName]['type']>;
    REQUEST: (
      contextSpec: AmplifyServer.ContextSpec,
      ...params: CustomOperationFnParams<OperationDefs[OpName]['args']>
    ) => SingularReturnValue<OperationDefs[OpName]['type']>;
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
export type EnumTypes<T extends Record<any, any>> = {
  [EnumName in keyof AllEnumTypesRecursively<T>]: {
    values: () => Array<AllEnumTypesRecursively<T>[EnumName]['type']>;
  };
};

type AllEnumTypesRecursively<T extends Record<any, any>> =
  ClientSchemaByEntityType<T>['enums'] &
    Select<
      ExtractNestedTypes<ClientSchemaByEntityType<T>>,
      { __entityType: 'enum' }
    >;

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

export type ClientExtensions<T extends Record<any, any> = never> = {
  models: ModelTypes<T, 'CLIENT'>;
  enums: EnumTypes<T>;
  queries: CustomQueries<T, 'CLIENT'>;
  mutations: CustomMutations<T, 'CLIENT'>;
  subscriptions: CustomSubscriptions<T, 'CLIENT'>;
  conversations: ConversationRoutes<T>;
  generations: Generations<T>;
};

export type ClientExtensionsSSRRequest<T extends Record<any, any> = never> = {
  models: ModelTypes<T, 'REQUEST'>;
  enums: EnumTypes<T>;
  queries: CustomQueries<T, 'REQUEST'>;
  mutations: CustomMutations<T, 'REQUEST'>;
};

export type ClientExtensionsSSRCookies<T extends Record<any, any> = never> = {
  models: ModelTypes<T, 'COOKIES'>;
  enums: EnumTypes<T>;
  queries: CustomQueries<T, 'COOKIES'>;
  mutations: CustomMutations<T, 'COOKIES'>;
};

export type ConversationRoutes<
  T extends Record<any, any>,
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = {
  [ConversationName in keyof Schema['conversations']]: ConversationRoute;
};

export type Generations<
  T extends Record<any, any>,
  Schema extends ClientSchemaByEntityType<T> = ClientSchemaByEntityType<T>,
> = CustomOperations<Schema['generations']>;
