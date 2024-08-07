// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema } from '../../../src/runtime/bridge-types';
import { pickConversationMessageProperties } from '../../../src/runtime/internals/ai/pickConversationMessageProperties';
import { createSendMessageFunction } from '../../../src/runtime/internals/ai/createSendMessageFunction';
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';

jest.mock(
  '../../../src/runtime/internals/ai/pickConversationMessageProperties',
);
jest.mock('../../../src/runtime/internals/operations/custom');

describe('createSendMessageFunction()', () => {
  let sendMessage: Conversation['sendMessage'];
  const mockContent = [{ text: 'foo' }];
  const mockAiContext = { location: 'Seattle, WA' };
  const mockToolConfiguration = {
    tools: {
      myTool: {
        inputSchema: {
          json: {},
        },
      },
    },
  };
  const mockConversationName = 'conversation-name';
  const mockConversationId = 'conversation-id';
  const mockMessage = {
    content: [{ text: 'foo' }],
    conversationId: mockConversationId,
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id',
    role: 'user',
  };
  const mockConversationSchema = { message: { send: {} } };
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: mockConversationSchema },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  const mockpickConversationMessageProperties =
    pickConversationMessageProperties as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();

  beforeAll(async () => {
    mockpickConversationMessageProperties.mockImplementation((data) => data);
    mockCustomOp.mockReturnValue({ data: mockMessage });
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
    sendMessage = await createSendMessageFunction(
      {} as BaseClient,
      mockModelIntrospectionSchema,
      mockConversationId,
      mockConversationName,
      jest.fn(),
    );
  });

  it('returns a sendMessage function', async () => {
    expect(sendMessage).toBeDefined();
  });

  describe('sendMessage()', () => {
    it('sends a message', async () => {
      const { data } = await sendMessage({
        aiContext: mockAiContext,
        content: mockContent,
        toolConfiguration: mockToolConfiguration,
      });

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'mutation',
        mockConversationSchema.message.send,
        false,
        expect.any(Function),
      );
      expect(mockCustomOp).toHaveBeenCalledWith({
        aiContext: JSON.stringify(mockAiContext),
        content: mockContent,
        conversationId: mockConversationId,
        toolConfiguration: mockToolConfiguration,
      });
      expect(data).toBe(mockMessage);
    });
  });
});
