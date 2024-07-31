// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';
import { createListMessagesFunction } from '../../../src/runtime/internals/ai/createListMessagesFunction';
import { listFactory } from '../../../src/runtime/internals/operations/list';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversationMessage');
jest.mock('../../../src/runtime/internals/operations/list');

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
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: {} },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockListFactory = listFactory as jest.Mock;
  const mockConvertItemToConversationMessage =
    convertItemToConversationMessage as jest.Mock;
  // create mocks
  const mockList = jest.fn();

  beforeAll(async () => {
    mockConvertItemToConversationMessage.mockImplementation((data) => data);
    mockList.mockReturnValue({ data: [mockMessage, mockMessage2] });
    mockListFactory.mockReturnValue(mockList);
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

      expect(mockListFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        {},
        expect.any(Function),
      );
      expect(mockList).toHaveBeenCalled();
      expect(data).toStrictEqual([mockMessage, mockMessage2]);
    });

    it('returns empty list if no messages are found', async () => {
      mockList.mockReturnValue({ data: [] });

      const { data } = await listMessages();
      expect(data).toStrictEqual([]);
    });
  });
});
