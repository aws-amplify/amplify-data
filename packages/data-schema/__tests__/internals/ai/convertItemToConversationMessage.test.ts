// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';

describe('convertItemToConversationMessage()', () => {
  const mockContent = [{ text: 'foo' }];
  const mockMessageItem = {
    content: JSON.stringify(mockContent),
    conversationId: 'conversation-id',
    createdAt: '2024-07-16T00:00:00Z',
    id: 'message-id',
    role: 'assistant',
  };
  it('returns a conversation', () => {
    expect(convertItemToConversationMessage(mockMessageItem)).toStrictEqual({
      ...mockMessageItem,
      content: mockContent,
    });
  });
});
