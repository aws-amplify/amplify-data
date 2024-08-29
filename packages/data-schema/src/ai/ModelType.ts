// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  claude3Haiku,
  claude3Opus,
  claude3Sonnet,
  claude3_5Sonnet,
} from './supportedModels/anthropic';
import { commandR, commandRPlus } from './supportedModels/cohere';
import {
  llama3_18BInstruct,
  llama3_170BInstruct,
  llama3_1405BInstruct,
} from './supportedModels/meta';
import {
  mistralLarge,
  mistralLarge2,
  mistralSmall,
} from './supportedModels/mistralAi';

export interface AiModel {
  resourcePath: string;
}

export interface InferenceConfiguration {
  topP?: number;
  temperature?: number;
  maxTokens?: number;
}

export const model = {
  claude3Haiku,
  claude3Opus,
  claude3Sonnet,
  claude3_5Sonnet,
  commandR,
  commandRPlus,
  llama3_18BInstruct,
  llama3_170BInstruct,
  llama3_1405BInstruct,
  mistralLarge,
  mistralLarge2,
  mistralSmall,
};
