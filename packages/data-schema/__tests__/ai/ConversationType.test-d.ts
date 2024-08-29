// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { claude3Haiku } from '../../src/ai/supportedModels/anthropic';
import {
  conversation,
  type ConversationInput,
  type ConversationType,
} from '../../src/ai/ConversationType';

const input: ConversationInput = {
  aiModel: claude3Haiku(),
  systemPrompt: 'Hello, world!',
  inferenceConfiguration: {
    topP: 1,
    temperature: 1,
    maxTokens: 1000,
  },
};

describe('ConversationType', () => {
  test('Happy case', () => {
    const result = conversation(input);

    type Expected = ConversationType;

    type Result = typeof result;

    type test = Expect<Equal<Result, Expected>>;
  });
});
