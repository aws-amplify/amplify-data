// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '../ModelType';

/**
 * @experimental
 *
 * Anthropic Claude 3 Haiku
 */
export function claude3Haiku(): AiModel {
  return { resourcePath: 'anthropic.claude-3-haiku-20240307-v1:0' };
}

/**
 * @experimental
 *
 * Anthropic Claude 3 Opus
 */
export function claude3Opus(): AiModel {
  return { resourcePath: 'anthropic.claude-3-opus-20240229-v1:0' };
}

/**
 * @experimental
 *
 * Anthropic Claude 3 Sonnet
 */
export function claude3Sonnet(): AiModel {
  return { resourcePath: 'anthropic.claude-3-sonnet-20240229-v1:0' };
}

/**
 * @experimental
 *
 * Anthropic Claude 3.5 Sonnet
 */
export function claude3_5Sonnet(): AiModel {
  return { resourcePath: 'anthropic.claude-3-5-sonnet-20240620-v1:0' };
}
