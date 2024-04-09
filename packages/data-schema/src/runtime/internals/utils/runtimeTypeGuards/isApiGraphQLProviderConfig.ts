// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GraphQLProviderConfig } from '../../../bridge-types';

export function isApiGraphQLConfig(
  apiGraphQLConfig: GraphQLProviderConfig['GraphQL'] | undefined,
): apiGraphQLConfig is GraphQLProviderConfig['GraphQL'] {
  return apiGraphQLConfig !== undefined;
}
