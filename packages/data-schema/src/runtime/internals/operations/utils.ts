// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// import { GraphQLFormattedError } from '@aws-amplify/data-schema-types';

import {
  CustomUserAgentDetails,
  INTERNAL_USER_AGENT_OVERRIDE,
} from '../../bridge-types';

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

/**
 * Creates a user agent override object based on custom details.
 * 
 * @internal
 * This function is intended for internal use within the Amplify library.
 * It may change or be removed in future versions without notice.
 * 
 * @param customUserAgentDetails - Optional custom user agent details
 * @returns An object with INTERNAL_USER_AGENT_OVERRIDE symbol as key and customUserAgentDetails as value, or undefined if no details provided
 */
export function createUserAgentOverride(
  customUserAgentDetails?: CustomUserAgentDetails,
): { [INTERNAL_USER_AGENT_OVERRIDE]?: CustomUserAgentDetails } | undefined {
  return customUserAgentDetails
    ? { [INTERNAL_USER_AGENT_OVERRIDE]: customUserAgentDetails }
    : undefined;
}
