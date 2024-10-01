// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';
import { createDeleteConversationFunction } from '../../../src/runtime/internals/ai/createDeleteConversationFunction';
import { getFactory } from '../../../src/runtime/internals/operations/get';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversation');
jest.mock('../../../src/runtime/internals/operations/get');

describe('createDeleteConversationFunction()', () => {
  let deleteConversation: ConversationRoute['delete'];
  const mockConversationName = 'conversation-name';
  const mockConversation = {
    id: 'conversation-id',
    createdAt: '2023-06-01T12:00:00Z',
    updatedAt: '2023-06-01T12:00:00Z',
    metadata: {},
    name: mockConversationName,
  };
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  const mockConvertItemToConversation = convertItemToConversation as jest.Mock;
  // create mocks
  const mockDelete = jest.fn();

  beforeAll(async () => {
    mockDelete.mockReturnValue({ data: mockConversation });
    mockGetFactory.mockReturnValue(mockDelete);
    deleteConversation = await createDeleteConversationFunction(
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

  it('returns a deleteConversation function', async () => {
    expect(deleteConversation).toBeDefined();
  });

  describe('deleteConversation()', () => {
    it('deletes a conversation', async () => {
      await deleteConversation({ id: mockConversation.id });

      expect(mockGetFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        'DELETE',
        expect.any(Function),
        false,
        { category: 'ai', action: '4' },
      );
      expect(mockDelete).toHaveBeenCalledWith({ id: mockConversation.id });
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
        mockConversationName
      );
    });

    it('returns null if conversation not found', async () => {
      mockDelete.mockReturnValue({ data: null });

      const { data } = await deleteConversation({ id: 'non-existent-id' });
      expect(data).toBeNull();
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('Delete failed');
      mockDelete.mockRejectedValue(mockError);

      await expect(deleteConversation({ id: mockConversation.id })).rejects.toThrow('Delete failed');
    });

    it('passes through errors from the delete operation', async () => {
      const mockErrors = [{ message: 'Delete operation failed' }];
      mockDelete.mockReturnValue({ data: null, errors: mockErrors });

      const { data, errors } = await deleteConversation({ id: mockConversation.id });
      expect(data).toBeNull();
      expect(errors).toEqual(mockErrors);
    });
  });
});