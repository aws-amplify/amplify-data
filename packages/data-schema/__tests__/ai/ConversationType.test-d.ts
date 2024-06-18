// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import {
  type ConversationType,
  conversation,
} from '../../src/ai/ConversationType';

describe('ConversationType', () => {
  test('Happy case', () => {
    const result = conversation();

    type Expected = ConversationType;

    type Result = typeof result;

    type test = Expect<Equal<Result, Expected>>;
  });
});
