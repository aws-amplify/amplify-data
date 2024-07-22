// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ResolvedModel,
  CustomSelectionSetReturnValue,
  ContextType,
  ModelTypesClient,
  ModelTypesSSRCookies,
  ModelTypesSSRRequest,
  CustomOperationFnParams,
} from './internal.types';
import {
  ModelPath,
  ObservedReturnValue,
  SingularReturnValue,
} from './shared.types';

import { __modelMeta__, ExtractModelMeta } from './symbol';

export { __modelMeta__, ExtractModelMeta } from './symbol';

// #region Return Value Mapped Types

export type SelectionSet<
  Model extends Record<string, unknown>,
  Path extends ReadonlyArray<ModelPath<FlatModel>>,
  FlatModel extends Record<string, unknown> = ResolvedModel<Model>,
> = CustomSelectionSetReturnValue<FlatModel, Path[number]>;
// #endregion

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
