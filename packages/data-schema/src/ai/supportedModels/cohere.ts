// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '../ModelType';

/**
 * @experimental
 *
 * Cohere Command R
 */
export function commandR(): AiModel {
  return { resourcePath: 'cohere.command-r-v1:0' };
}

/**
 * @experimental
 *
 * Cohere Command R+
 */
export function commandRPlus(): AiModel {
  return { resourcePath: 'cohere.command-r-plus-v1:0' };
}
