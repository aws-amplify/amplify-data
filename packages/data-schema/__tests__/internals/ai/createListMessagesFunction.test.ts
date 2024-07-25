// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema, SchemaModel } from '../../../src/runtime/bridge-types';
import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';
import { createListMessagesFunction } from '../../../src/runtime/internals/ai/createListMessagesFunction';
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversationMessage');
jest.mock('../../../src/runtime/internals/operations/custom');

describe('createListMessagesFunction()', () => {
  let listMessages: Conversation['listMessages'];
  const mockConversationName = 'conversation-name';
  const mockConversationId = 'conversation-id';
  const mockMessage = {
    content: JSON.stringify([{ text: 'foo' }]),
    conversationId: mockConversationId,
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id',
    role: 'user',
  };
  const mockMessage2 = {
    content: JSON.stringify([{ text: 'bar' }]),
    conversationId: mockConversationId,
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id-2',
    role: 'assistant',
  };
  const mockConversationSchema = { message: { list: {} } };
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: mockConversationSchema },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  const mockConvertItemToConversationMessage =
    convertItemToConversationMessage as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();

  beforeAll(async () => {
    mockConvertItemToConversationMessage.mockImplementation((data) => data);
    mockCustomOp.mockReturnValue({ data: [mockMessage, mockMessage2] });
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
    listMessages = await createListMessagesFunction(
      {} as BaseClient,
      mockModelIntrospectionSchema,
      mockConversationId,
      {} as SchemaModel,
      jest.fn(),
    );
  });

  it('returns a listMessages function', async () => {
    expect(listMessages).toBeDefined();
  });

  describe('listMessages()', () => {
    it('lists messages', async () => {
      const { data } = await listMessages();

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'query',
        mockConversationSchema.message.list,
        false,
        expect.any(Function),
      );
      expect(mockCustomOp).toHaveBeenCalled();
      expect(data).toStrictEqual([mockMessage, mockMessage2]);
    });

    it('returns empty list if no messages are found', async () => {
      mockCustomOp.mockReturnValue({ data: [] });

      const { data } = await listMessages();
      expect(data).toStrictEqual([]);
    });
  });
});
