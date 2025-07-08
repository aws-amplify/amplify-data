// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '@aws-amplify/data-schema-types';

const supportedModelsLookup = {
  // Amazon Nova models
  'Amazon Nova Pro': 'amazon.nova-pro-v1:0',
  'Amazon Nova Lite': 'amazon.nova-lite-v1:0',
  'Amazon Nova Micro': 'amazon.nova-micro-v1:0',
  // Anthropic models
  'Claude 3 Haiku': 'anthropic.claude-3-haiku-20240307-v1:0',
  'Claude 3 Opus': 'anthropic.claude-3-opus-20240229-v1:0',
  'Claude 3 Sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',
  'Claude 3.5 Haiku': 'anthropic.claude-3-5-haiku-20241022-v1:0',
  'Claude 3.5 Sonnet': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  'Claude 3.5 Sonnet v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  'Claude 3.7 Sonnet': 'anthropic.claude-3-7-sonnet-20250219-v1:0',
  'Claude Opus 4': 'anthropic.claude-opus-4-20250514-v1:0',
  'Claude Sonnet 4': 'anthropic.claude-sonnet-4-20250514-v1:0',
  // Cohere models
  'Cohere Command R': 'cohere.command-r-v1:0',
  'Cohere Command R+': 'cohere.command-r-plus-v1:0',
  // Meta models
  'Llama 3.1 8B Instruct': 'meta.llama3-1-8b-instruct-v1:0',
  'Llama 3.1 70B Instruct': 'meta.llama3-1-70b-instruct-v1:0',
  'Llama 3.1 405B Instruct': 'meta.llama3-1-405b-instruct-v1:0',
  // Mistral AI models
  'Mistral Large': 'mistral.mistral-large-2402-v1:0',
  'Mistral Large 2': 'mistral.mistral-large-2407-v1:0',
  'Mistral Small': 'mistral.mistral-small-2402-v1:0',
} as const;

export interface InferenceConfiguration {
  topP?: number;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Bedrock models currently supporting Converse API and Tool use
 * @see {@link https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html#conversation-inference-supported-models-features}
 */
export function model(modelName: keyof typeof supportedModelsLookup): AiModel {
  return {
    resourcePath: supportedModelsLookup[modelName],
  };
}
