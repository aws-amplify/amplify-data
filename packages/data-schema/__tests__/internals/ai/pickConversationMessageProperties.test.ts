// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { pickConversationMessageProperties } from '../../../src/runtime/internals/ai/pickConversationMessageProperties';

describe('pickConversationMessageProperties()', () => {
  const mockMessageItem = {
    content: [{ text: 'foo' }],
    conversationId: 'conversation-id',
    createdAt: '2024-07-16T00:00:00Z',
    id: 'message-id',
    role: 'assistant',
  };

  it('returns a conversation', () => {
    expect(
      pickConversationMessageProperties({ ...mockMessageItem, foo: 'bar' }),
    ).toStrictEqual(mockMessageItem);
  });
});
