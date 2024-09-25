// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// import { GraphQLFormattedError } from '@aws-amplify/data-schema-types';

/**
 * Handle errors for list return types (list and index query operations)
 */
export function handleListGraphQlError(error: any) {
  if (error?.errors) {
    // graphql errors pass through
    return {
      ...error,
      data: [],
    } as any;
  } else {
    // non-graphql errors are re-thrown
    throw error;
  }
}

/**
 * Handle errors for singular return types (create, get, update, delete operations)
 */
export function handleSingularGraphQlError(error: any) {
  if (error.errors) {
    // graphql errors pass through
    return {
      ...error,
      data: null,
    } as any;
  } else {
    // non-graphql errors are re-thrown
    throw error;
  }
}
