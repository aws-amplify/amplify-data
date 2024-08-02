// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema } from '../../../src/runtime/bridge-types';
import { createOnMessageFunction } from '../../../src/runtime/internals/ai/createOnMessageFunction';
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';

jest.mock('../../../src/runtime/internals/operations/custom');

describe('createOnMessageFunction()', () => {
  let onMessage: Conversation['onMessage'];
  const mockConversationName = 'conversation-name';
  const mockConversationId = 'conversation-id';
  const mockContent = [{ text: 'foo' }];
  const mockRole = 'user';
  const mockCreatedAt = '2024-06-27T00:00:00Z';
  const mockMessageId = 'message-id';
  const mockMessage = {
    content: JSON.stringify(mockContent),
    sessionId: mockConversationId,
    createdAt: mockCreatedAt,
    id: mockMessageId,
    sender: mockRole,
  };
  const mockConversationSchema = { message: { subscribe: {} } };
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: mockConversationSchema },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();
  const mockSubscribe = jest.fn();
  const mockHandler = jest.fn();

  beforeAll(async () => {
    mockCustomOp.mockReturnValue({ subscribe: mockSubscribe });
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
    mockSubscribe.mockImplementation((subscription) => {
      subscription(mockMessage);
    });
    onMessage = await createOnMessageFunction(
      {} as BaseClient,
      mockModelIntrospectionSchema,
      mockConversationId,
      mockConversationName,
      jest.fn(),
    );
  });

  it('returns a onMessage function', async () => {
    expect(onMessage).toBeDefined();
  });

  describe('onMessage()', () => {
    it('triggers handler', async () => {
      onMessage(mockHandler);

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'subscription',
        mockConversationSchema.message.subscribe,
        false,
        expect.any(Function),
      );
      expect(mockCustomOp).toHaveBeenCalledWith({
        sessionId: mockConversationId,
      });
      expect(mockHandler).toHaveBeenCalledWith({
        content: mockContent,
        conversationId: mockConversationId,
        createdAt: mockCreatedAt,
        id: mockMessageId,
        role: mockRole,
      });
    });
  });
});
