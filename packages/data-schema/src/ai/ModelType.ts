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

  // Cross-region inference profiles

  // us-east-1 us-west-2
  'US Anthropic Claude 3 Sonnet': 'us.anthropic.claude-3-sonnet-20240229-v1:0',
  'US Anthropic Claude 3 Opus': 'us.anthropic.claude-3-opus-20240229-v1:0',
  'US Anthropic Claude 3 Haiku': 'us.anthropic.claude-3-haiku-20240307-v1:0',

  // us-east-1 us-east-2 us-west-2
  'US Anthropic Claude 3.5 Sonnet': 'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'US Anthropic Claude 3.5 Haiku': 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
  'US Anthropic Claude 3.5 Sonnet v2': 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
  'US Anthropic Claude 3.7 Sonnet': 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',

  // us-east-1 us-east-2 us-west-2
  'US Nova Lite': 'us.amazon.nova-lite-v1:0',
  'US Nova Pro': 'us.amazon.nova-pro-v1:0',
  'US Nova Micro': 'us.amazon.nova-micro-v1:0',

  // eu-central-1 eu-west-1 eu-west-3
  'EU Anthropic Claude 3 Sonnet': 'eu.anthropic.claude-3-sonnet-20240229-v1:0',
  'EU Anthropic Claude 3.5 Sonnet': 'eu.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'EU Anthropic Claude 3 Haiku': 'eu.anthropic.claude-3-haiku-20240307-v1:0',

  // ap-northeast-1 ap-northeast-2 ap-south-1 ap-southeast-1 ap-southeast-2
  'APAC Anthropic Claude 3 Sonnet': 'apac.anthropic.claude-3-sonnet-20240229-v1:0',
  'APAC Anthropic Claude 3.5 Sonnet': 'apac.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'APAC Anthropic Claude 3 Haiku': 'apac.anthropic.claude-3-haiku-20240307-v1:0',
  'APAC Anthropic Claude 3.5 Sonnet v2': 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0',
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
