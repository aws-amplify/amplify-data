// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '../ModelType';

/**
 * @experimental
 *
 * Meta Llama 3.1 8B Instruct
 */
export function llama3_18BInstruct(): AiModel {
  return { resourcePath: 'meta.llama3-1-8b-instruct-v1:0' };
}

/**
 * @experimental
 *
 * Meta Llama 3.1 70B Instruct
 */
export function llama3_170BInstruct(): AiModel {
  return { resourcePath: 'meta.llama3-1-70b-instruct-v1:0' };
}

/**
 * @experimental
 *
 * Meta Llama 3.1 405B Instruct
 */
export function llama3_1405BInstruct(): AiModel {
  return { resourcePath: 'meta.llama3-1-405b-instruct-v1:0' };
}
