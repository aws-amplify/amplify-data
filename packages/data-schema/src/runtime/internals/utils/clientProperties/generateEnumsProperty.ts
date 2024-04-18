// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
} from '../../../bridge-types';
import { EnumTypes } from '../../../client';

export const generateEnumsProperty = <T extends Record<any, any> = never>(
  graphqlConfig: GraphQLProviderConfig['GraphQL'],
): EnumTypes<T> => {
  const modelIntrospection: ModelIntrospectionSchema | undefined =
    graphqlConfig.modelIntrospection;

  if (!modelIntrospection) {
    return {} as EnumTypes<never>;
  }

  const enums: Record<
    string,
    {
      values(): string[];
    }
  > = {};

  for (const [_, enumData] of Object.entries(modelIntrospection.enums)) {
    enums[enumData.name] = {
      values: () => enumData.values,
    };
  }

  return enums as EnumTypes<T>;
};
