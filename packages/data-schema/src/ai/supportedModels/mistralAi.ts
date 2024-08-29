// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '../ModelType';

/**
 * @experimental
 *
 * Mistral AI Mistral Large
 */
export function mistralLarge(): AiModel {
  return { resourcePath: 'mistral.mistral-large-2402-v1:0' };
}

/**
 * @experimental
 *
 * Mistral AI Mistral Large 2 (24.07)
 */
export function mistralLarge2(): AiModel {
  return { resourcePath: 'mistral.mistral-large-2407-v1:0' };
}

/**
 * @experimental
 *
 * Mistral AI Mistral Small
 */
export function mistralSmall(): AiModel {
  return { resourcePath: 'mistral.mistral-small-2402-v1:0' };
}
