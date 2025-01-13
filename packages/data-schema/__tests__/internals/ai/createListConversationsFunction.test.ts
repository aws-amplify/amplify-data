// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';
import { createListConversationsFunction } from '../../../src/runtime/internals/ai/createListConversationsFunction';
import { listFactory } from '../../../src/runtime/internals/operations/list';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversation');
jest.mock('../../../src/runtime/internals/operations/list');

describe('createListConversationsFunction()', () => {
  let listConversations: ConversationRoute['list'];
  const mockConversationName = 'conversation-name';
  const mockConversation = {
    id: 'conversation-id',
    createdAt: '2023-06-01T12:00:00Z',
    updatedAt: '2023-08-02T12:00:00Z',
    metadata: {},
    name: mockConversationName,
  };
  const mockConversation2 = {
    id: 'conversation-id2',
    createdAt: '2024-09-02T12:00:00Z',
    updatedAt: '2024-09-05T12:00:00Z',
    metadata: {},
    name: mockConversationName,
  };
  // assert mocks
  const mocklistFactory = listFactory as jest.Mock;
  const mockConvertItemToConversation = convertItemToConversation as jest.Mock;
  // create mocks
  const mockList = jest.fn();

  beforeAll(async () => {
    mockList.mockReturnValue({ data: [mockConversation, mockConversation2] });
    mocklistFactory.mockReturnValue(mockList);
    listConversations = await createListConversationsFunction(
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      mockConversationName,
      {} as SchemaModel,
      {} as SchemaModel,
      jest.fn(),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a listConversations function', async () => {
    expect(listConversations).toBeDefined();
  });

  describe('listConversations()', () => {
    it('lists conversations', async () => {
      await listConversations();

      expect(mocklistFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        expect.any(Function),
        false,
        { action: '3', category: 'ai' },
      );
      expect(mockList).toHaveBeenCalled();
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation.id,
        '2023-06-01T12:00:00Z',
        '2023-08-02T12:00:00Z',
        mockConversationName,
        {},
        expect.any(Function),
        {},
        mockConversationName,
      );
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation2.id,
        '2024-09-02T12:00:00Z',
        '2024-09-05T12:00:00Z',
        mockConversationName,
        {},
        expect.any(Function),
        {},
        mockConversationName,
      );
    });

    it('returns empty list if no conversations are found', async () => {
      mockList.mockReturnValue({ data: [] });

      const { data } = await listConversations();
      expect(data).toStrictEqual([]);
    });
  });
});
