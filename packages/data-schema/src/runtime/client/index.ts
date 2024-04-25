// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  Prettify,
  __modelMeta__,
  ExtractModelMeta,
} from '@aws-amplify/data-schema-types';
import {
  AuthMode,
  CreateModelInput,
  CustomHeaders,
  ExcludeNeverFields,
  IndexQueryMethodsFromIR,
  ListReturnValue,
  ObservedReturnValue,
  ObserveQueryReturnValue,
  ModelFilter,
  ModelIdentifier,
  ModelMetaShape,
  ModelPath,
  ModelSortDirection,
  MutationInput,
  ResolvedModel,
  ReturnValue,
  SingularReturnValue,
} from '../../MappedTypes/ClientMaps';

export {
  __modelMeta__,
  ExtractModelMeta,
} from '@aws-amplify/data-schema-types';

export {
  AuthMode,
  CustomHeaders,
  GraphQLFormattedError,
  ListReturnValue,
  ModelSortDirection,
  SingularReturnValue,
} from '../../MappedTypes/ClientMaps';

// TODO: remove export. added for debugging.
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

type ModelTypesSSRCookies<
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

type ModelTypesSSRRequest<
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

type ContextType = 'CLIENT' | 'COOKIES' | 'REQUEST';

export type ModelTypes<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends Record<any, any> = T['__AmplifyInternal']['v1Schema'],
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
        ? ModelTypesClient<Schema[ModelName], ModelMeta[ModelName]>
        : Context extends 'COOKIES'
          ? ModelTypesSSRCookies<Schema[ModelName], ModelMeta[ModelName]>
          : Context extends 'REQUEST'
            ? ModelTypesSSRRequest<Schema[ModelName], ModelMeta[ModelName]>
            : never
      : never
    : never;
};

export type CustomQueries<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends Record<any, any> = T['__AmplifyInternal']['v1Schema'],
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = CustomOperations<Schema, 'Query', Context, ModelMeta>;

export type CustomMutations<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends Record<any, any> = T['__AmplifyInternal']['v1Schema'],
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = CustomOperations<Schema, 'Mutation', Context, ModelMeta>;

export type CustomSubscriptions<
  T extends Record<any, any>,
  Context extends ContextType = 'CLIENT',
  Schema extends Record<any, any> = T['__AmplifyInternal']['v1Schema'],
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
  T extends Record<any, any>,
  Schema extends Record<any, any> = T['__AmplifyInternal']['v1Schema'],
  ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = {
  [EnumName in keyof ModelMeta['enums']]: {
    values: () => Array<ModelMeta['enums'][EnumName]>;
  };
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
