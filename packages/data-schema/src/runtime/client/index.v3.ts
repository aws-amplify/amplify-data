// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  __modelMeta__,
  ExtractModelMeta,
} from '@aws-amplify/data-schema-types';

export {
  __modelMeta__,
  ExtractModelMeta,
} from '@aws-amplify/data-schema-types';

export type ModelTypes<
  _T extends Record<any, any> = never,
  _Context extends string = 'CLIENT',
  _ModelMeta extends Record<any, any> = any,
> = any;
export type EnumTypes<
  _T extends Record<any, any> = never,
  _ModelMeta extends Record<any, any> = any,
> = any;

export type SelectionSet<_Model, _Path> = any;

/**
 * Custom headers that can be passed either to the client or to individual
 * model operations, either as a static object or a function that returns a
 * promise.
 */
export type CustomHeaders =
  | Record<string, string>
  | (() => Promise<Record<string, string>>);

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

export type CustomQueries<
  Schema extends Record<any, any>,
  _Context extends string = 'CLIENT',
  _ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = any;

export type CustomMutations<
  Schema extends Record<any, any>,
  _Context extends string = 'CLIENT',
  _ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = any;

export type CustomSubscriptions<
  Schema extends Record<any, any>,
  _Context extends string = 'CLIENT',
  _ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>,
> = any;

export type ModelSortDirection = 'ASC' | 'DESC';

export type ClientExtensions<T extends Record<any, any> = never> = {
  models: ModelTypes<T>;
  enums: EnumTypes<T>;
  queries: CustomQueries<T, 'CLIENT'>;
  mutations: CustomMutations<T, 'CLIENT'>;
  subscriptions: CustomSubscriptions<T, 'CLIENT'>;
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

export type ClientInternals = {
  amplify: any;
  authMode: any;
  authToken: string | undefined;
  headers: CustomHeaders | undefined;
};

export type BaseClient = {
  graphql(...args: any): Promise<Record<string, any>>;
  cancel(promise: Promise<any>, message?: string): boolean;
  isCancelError(error: any): boolean;
};
