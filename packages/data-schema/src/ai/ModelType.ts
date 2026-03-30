// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '@aws-amplify/data-schema-types';

const supportedModelsLookup = {
  // ============================================================
  // Amazon Nova models
  // ============================================================
  'Amazon Nova Pro': 'amazon.nova-pro-v1:0',
  'Amazon Nova Lite': 'amazon.nova-lite-v1:0',
  'Amazon Nova Micro': 'amazon.nova-micro-v1:0',
  'Amazon Nova Premier': 'amazon.nova-premier-v1:0',
  // Amazon Nova inference profiles
  'Amazon Nova Pro (US)': 'us.amazon.nova-pro-v1:0',
  'Amazon Nova Pro (EU)': 'eu.amazon.nova-pro-v1:0',
  'Amazon Nova Pro (APAC)': 'apac.amazon.nova-pro-v1:0',
  'Amazon Nova Lite (US)': 'us.amazon.nova-lite-v1:0',
  'Amazon Nova Lite (EU)': 'eu.amazon.nova-lite-v1:0',
  'Amazon Nova Lite (APAC)': 'apac.amazon.nova-lite-v1:0',
  'Amazon Nova Lite (CA)': 'ca.amazon.nova-lite-v1:0',
  'Amazon Nova Micro (US)': 'us.amazon.nova-micro-v1:0',
  'Amazon Nova Micro (EU)': 'eu.amazon.nova-micro-v1:0',
  'Amazon Nova Micro (APAC)': 'apac.amazon.nova-micro-v1:0',
  'Amazon Nova Premier (US)': 'us.amazon.nova-premier-v1:0',

  // ============================================================
  // Anthropic Claude models
  // ============================================================
  'Claude 3 Haiku': 'anthropic.claude-3-haiku-20240307-v1:0',
  'Claude 3 Opus': 'anthropic.claude-3-opus-20240229-v1:0',
  'Claude 3 Sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',
  'Claude 3.5 Haiku': 'anthropic.claude-3-5-haiku-20241022-v1:0',
  'Claude 3.5 Sonnet': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  'Claude 3.5 Sonnet v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  'Claude 3.7 Sonnet': 'anthropic.claude-3-7-sonnet-20250219-v1:0',
  'Claude Opus 4': 'anthropic.claude-opus-4-20250514-v1:0',
  'Claude Opus 4.1': 'anthropic.claude-opus-4-1-20250805-v1:0',
  'Claude Sonnet 4': 'anthropic.claude-sonnet-4-20250514-v1:0',
  'Claude Sonnet 4.6': 'anthropic.claude-sonnet-4-6',
  'Claude Opus 4.6': 'anthropic.claude-opus-4-6-v1',
  // Claude 4.5 models (require global inference profiles — DO NOT CHANGE existing mappings)
  'Claude Haiku 4.5': 'global.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Sonnet 4.5': 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Opus 4.5': 'global.anthropic.claude-opus-4-5-20251101-v1:0',
  // Anthropic inference profiles
  'Claude 3 Haiku (US)': 'us.anthropic.claude-3-haiku-20240307-v1:0',
  'Claude 3 Haiku (EU)': 'eu.anthropic.claude-3-haiku-20240307-v1:0',
  'Claude 3 Haiku (APAC)': 'apac.anthropic.claude-3-haiku-20240307-v1:0',
  'Claude 3 Opus (US)': 'us.anthropic.claude-3-opus-20240229-v1:0',
  'Claude 3 Sonnet (US)': 'us.anthropic.claude-3-sonnet-20240229-v1:0',
  'Claude 3 Sonnet (EU)': 'eu.anthropic.claude-3-sonnet-20240229-v1:0',
  'Claude 3 Sonnet (APAC)': 'apac.anthropic.claude-3-sonnet-20240229-v1:0',
  'Claude 3.5 Haiku (US)': 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
  'Claude 3.5 Sonnet (US)': 'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'Claude 3.5 Sonnet (EU)': 'eu.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'Claude 3.5 Sonnet (APAC)': 'apac.anthropic.claude-3-5-sonnet-20240620-v1:0',
  'Claude 3.5 Sonnet v2 (US)': 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
  'Claude 3.5 Sonnet v2 (APAC)':
    'apac.anthropic.claude-3-5-sonnet-20241022-v2:0',
  'Claude 3.7 Sonnet (US)': 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
  'Claude 3.7 Sonnet (EU)': 'eu.anthropic.claude-3-7-sonnet-20250219-v1:0',
  'Claude 3.7 Sonnet (APAC)': 'apac.anthropic.claude-3-7-sonnet-20250219-v1:0',
  'Claude Opus 4 (US)': 'us.anthropic.claude-opus-4-20250514-v1:0',
  'Claude Opus 4.1 (US)': 'us.anthropic.claude-opus-4-1-20250805-v1:0',
  'Claude Sonnet 4 (US)': 'us.anthropic.claude-sonnet-4-20250514-v1:0',
  'Claude Sonnet 4 (EU)': 'eu.anthropic.claude-sonnet-4-20250514-v1:0',
  'Claude Sonnet 4 (APAC)': 'apac.anthropic.claude-sonnet-4-20250514-v1:0',
  'Claude Sonnet 4 (Global)': 'global.anthropic.claude-sonnet-4-20250514-v1:0',
  'Claude Haiku 4.5 (US)': 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Haiku 4.5 (EU)': 'eu.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Haiku 4.5 (AU)': 'au.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Haiku 4.5 (JP)': 'jp.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Haiku 4.5 (Global)':
    'global.anthropic.claude-haiku-4-5-20251001-v1:0',
  'Claude Sonnet 4.5 (US)': 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Sonnet 4.5 (EU)': 'eu.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Sonnet 4.5 (AU)': 'au.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Sonnet 4.5 (JP)': 'jp.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Sonnet 4.5 (Global)':
    'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  'Claude Opus 4.5 (US)': 'us.anthropic.claude-opus-4-5-20251101-v1:0',
  'Claude Opus 4.5 (EU)': 'eu.anthropic.claude-opus-4-5-20251101-v1:0',
  'Claude Opus 4.5 (Global)': 'global.anthropic.claude-opus-4-5-20251101-v1:0',
  'Claude Sonnet 4.6 (US)': 'us.anthropic.claude-sonnet-4-6',
  'Claude Sonnet 4.6 (EU)': 'eu.anthropic.claude-sonnet-4-6',
  'Claude Sonnet 4.6 (AU)': 'au.anthropic.claude-sonnet-4-6',
  'Claude Sonnet 4.6 (JP)': 'jp.anthropic.claude-sonnet-4-6',
  'Claude Sonnet 4.6 (Global)': 'global.anthropic.claude-sonnet-4-6',
  'Claude Opus 4.6 (US)': 'us.anthropic.claude-opus-4-6-v1',
  'Claude Opus 4.6 (EU)': 'eu.anthropic.claude-opus-4-6-v1',
  'Claude Opus 4.6 (AU)': 'au.anthropic.claude-opus-4-6-v1',

  // ============================================================
  // Cohere models
  // ============================================================
  'Cohere Command R': 'cohere.command-r-v1:0',
  'Cohere Command R+': 'cohere.command-r-plus-v1:0',

  // ============================================================
  // DeepSeek models
  // ============================================================
  'DeepSeek R1': 'deepseek.r1-v1:0',
  'DeepSeek R1 (US)': 'us.deepseek.r1-v1:0',

  // ============================================================
  // Meta Llama models
  // ============================================================
  'Llama 3.1 8B Instruct': 'meta.llama3-1-8b-instruct-v1:0',
  'Llama 3.1 70B Instruct': 'meta.llama3-1-70b-instruct-v1:0',
  'Llama 3.1 405B Instruct': 'meta.llama3-1-405b-instruct-v1:0',
  'Llama 3.2 1B Instruct': 'meta.llama3-2-1b-instruct-v1:0',
  'Llama 3.2 3B Instruct': 'meta.llama3-2-3b-instruct-v1:0',
  'Llama 3.2 11B Instruct': 'meta.llama3-2-11b-instruct-v1:0',
  'Llama 3.2 90B Instruct': 'meta.llama3-2-90b-instruct-v1:0',
  'Llama 3.3 70B Instruct': 'meta.llama3-3-70b-instruct-v1:0',
  'Llama 4 Scout 17B Instruct': 'meta.llama4-scout-17b-instruct-v1:0',
  'Llama 4 Maverick 17B Instruct': 'meta.llama4-maverick-17b-instruct-v1:0',
  // Meta inference profiles
  'Llama 3.1 8B Instruct (US)': 'us.meta.llama3-1-8b-instruct-v1:0',
  'Llama 3.1 70B Instruct (US)': 'us.meta.llama3-1-70b-instruct-v1:0',
  'Llama 3.1 405B Instruct (US)': 'us.meta.llama3-1-405b-instruct-v1:0',
  'Llama 3.2 1B Instruct (US)': 'us.meta.llama3-2-1b-instruct-v1:0',
  'Llama 3.2 1B Instruct (EU)': 'eu.meta.llama3-2-1b-instruct-v1:0',
  'Llama 3.2 3B Instruct (US)': 'us.meta.llama3-2-3b-instruct-v1:0',
  'Llama 3.2 3B Instruct (EU)': 'eu.meta.llama3-2-3b-instruct-v1:0',
  'Llama 3.2 11B Instruct (US)': 'us.meta.llama3-2-11b-instruct-v1:0',
  'Llama 3.2 90B Instruct (US)': 'us.meta.llama3-2-90b-instruct-v1:0',
  'Llama 3.3 70B Instruct (US)': 'us.meta.llama3-3-70b-instruct-v1:0',
  'Llama 4 Scout 17B Instruct (US)': 'us.meta.llama4-scout-17b-instruct-v1:0',
  'Llama 4 Maverick 17B Instruct (US)':
    'us.meta.llama4-maverick-17b-instruct-v1:0',

  // ============================================================
  // Mistral AI models
  // ============================================================
  'Mistral Large': 'mistral.mistral-large-2402-v1:0',
  'Mistral Large 2': 'mistral.mistral-large-2407-v1:0',
  'Mistral Small': 'mistral.mistral-small-2402-v1:0',
  'Pixtral Large': 'mistral.pixtral-large-2502-v1:0',
  'Pixtral Large (US)': 'us.mistral.pixtral-large-2502-v1:0',
  'Pixtral Large (EU)': 'eu.mistral.pixtral-large-2502-v1:0',
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
