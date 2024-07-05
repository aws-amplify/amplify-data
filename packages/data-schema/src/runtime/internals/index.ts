// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export {
  generateCustomMutationsProperty,
  generateCustomQueriesProperty,
  generateCustomSubscriptionsProperty,
} from './generateCustomOperationsProperty';
export { generateConversationsProperty } from './utils/clientProperties/generateConversationsProperty';
export { generateGenerationsProperty } from './utils/clientProperties/generateGenerationsProperty';
export { generateEnumsProperty } from './utils/clientProperties/generateEnumsProperty';
export { generateModelsProperty } from './utils/clientProperties/generateModelsProperty';
export { isGraphQLResponseWithErrors } from './utils/runtimeTypeGuards/isGraphQLResponseWithErrors';
export { isApiGraphQLConfig } from './utils/runtimeTypeGuards/isApiGraphQLProviderConfig';
export { isConfigureEventWithResourceConfig } from './utils/runtimeTypeGuards/isConfigureEventWithResourceConfig';
