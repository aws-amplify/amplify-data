// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';

describe('convertItemToConversationMessage()', () => {
  const mockContent = [{ text: 'foo' }];
  const mockConversationId = 'conversation-id';
  const mockRole = 'assistant';
  const mockMessageItem = {
    content: JSON.stringify(mockContent),
    sessionId: mockConversationId,
    createdAt: '2024-07-16T00:00:00Z',
    id: 'message-id',
    sender: mockRole,
  };
  it('returns a conversation', () => {
    expect(convertItemToConversationMessage(mockMessageItem)).toStrictEqual({
      content: mockContent,
      conversationId: mockConversationId,
      createdAt: '2024-07-16T00:00:00Z',
      id: 'message-id',
      role: mockRole,
    });
  });
});
