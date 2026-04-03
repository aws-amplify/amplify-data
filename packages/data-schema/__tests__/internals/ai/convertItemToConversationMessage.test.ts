// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';
import { deserializeContent } from '../../../src/runtime/internals/ai/conversationMessageDeserializers';

jest.mock('../../../src/runtime/internals/ai/conversationMessageDeserializers');

describe('convertItemToConversationMessage()', () => {
  const mockMessageContent = [{ text: 'foo' }];
  const mockMessageItem = {
    content: mockMessageContent,
    conversationId: 'conversation-id',
    createdAt: '2024-07-16T00:00:00Z',
    id: 'message-id',
    role: 'assistant',
  };

  // assert mocks
  const mockDeserializeContent = deserializeContent as jest.Mock;

  beforeAll(() => {
    mockDeserializeContent.mockImplementation((item) => item);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a conversation message', () => {
    expect(
      convertItemToConversationMessage({
        ...mockMessageItem,
        extraneous: 'property',
      }),
    ).toStrictEqual(mockMessageItem);
    expect(mockDeserializeContent).toHaveBeenCalledWith(mockMessageContent);
  });

  it('includes metrics and usage when present', () => {
    const metrics = { latencyMs: 123 };
    const usage = { inputTokens: 10, outputTokens: 20, totalTokens: 30 };
    expect(
      convertItemToConversationMessage({
        ...mockMessageItem,
        metrics,
        usage,
      }),
    ).toStrictEqual({ ...mockMessageItem, metrics, usage });
  });

  it('omits metrics and usage when not present', () => {
    const result = convertItemToConversationMessage(mockMessageItem);
    expect(result).toStrictEqual(mockMessageItem);
    expect(result).not.toHaveProperty('metrics');
    expect(result).not.toHaveProperty('usage');
  });
});
