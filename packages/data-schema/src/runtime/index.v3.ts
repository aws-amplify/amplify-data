// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export * from './client/index.v3';
export declare function addSchemaToClient<T extends Record<any, any> = never>(
  client: any,
  apiGraphqlConfig: any,
  getInternals: any,
): any;
export declare function addSchemaToClientWithInstance<
  T extends Record<any, any>,
>(client: any, params: any, getInternals: any): any;
