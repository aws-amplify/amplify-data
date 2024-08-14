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
  const mockConversation = { id: 'conversation-id' };
  const mockConversation2 = { id: 'conversation-id-2' };
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
      );
      expect(mockList).toHaveBeenCalled();
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation.id,
        mockConversationName,
        {},
        expect.any(Function),
      );
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation2.id,
        mockConversationName,
        {},
        expect.any(Function),
      );
    });

    it('returns empty list if no conversations are found', async () => {
      mockList.mockReturnValue({ data: [] });

      const { data } = await listConversations();
      expect(data).toStrictEqual([]);
    });
  });
});
