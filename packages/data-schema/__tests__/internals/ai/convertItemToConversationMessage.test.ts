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
});
