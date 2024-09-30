// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';
import { createCreateConversationFunction } from '../../../src/runtime/internals/ai/createCreateConversationFunction';
import { getFactory } from '../../../src/runtime/internals/operations/get';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversation');
jest.mock('../../../src/runtime/internals/operations/get');

describe('createCreateConversationFunction()', () => {
  let createConversation: ConversationRoute['create'];
  const mockConversationName = 'conversation-name';
  const mockConversation = {
    id: 'conversation-id',
    createdAt: '2023-06-01T12:00:00Z',
    updatedAt: '2023-06-01T12:00:00Z',
    metadata: {},
    name: 'Test Conversation',
  };
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  const mockConvertItemToConversation = convertItemToConversation as jest.Mock;
  // create mocks
  const mockGet = jest.fn();

  beforeAll(async () => {
    mockGet.mockReturnValue({ data: mockConversation });
    mockGetFactory.mockReturnValue(mockGet);
    createConversation = await createCreateConversationFunction(
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

  it('returns a createConversation function', async () => {
    expect(createConversation).toBeDefined();
  });

  describe('createConversation()', () => {
    it('creates a conversation', async () => {
      await createConversation();

      expect(mockGetFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        'CREATE',
        expect.any(Function),
        false,
        { action: '1', category: 'ai' },
      );
      expect(mockGet).toHaveBeenCalled();
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation.id,
        '2023-06-01T12:00:00Z',
        '2023-06-01T12:00:00Z',
        mockConversationName,
        {},
        expect.any(Function),
        {},
        'Test Conversation',
      );
    });
  });
});
