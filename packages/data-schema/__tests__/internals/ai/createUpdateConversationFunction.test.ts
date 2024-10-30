// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';
import { createUpdateConversationFunction } from '../../../src/runtime/internals/ai/createUpdateConversationFunction';
import { getFactory } from '../../../src/runtime/internals/operations/get';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversation');
jest.mock('../../../src/runtime/internals/operations/get');

describe('createUpdateConversationFunction()', () => {
  let updateConversation: ConversationRoute['update'];
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
  const mockUpdate = jest.fn();

  beforeAll(async () => {
    mockUpdate.mockReturnValue({ data: mockConversation });
    mockGetFactory.mockReturnValue(mockUpdate);
    updateConversation = await createUpdateConversationFunction(
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

  it('returns an updateConversation function', async () => {
    expect(updateConversation).toBeDefined();
  });

  describe('updateConversation()', () => {
    it('updates a conversation', async () => {
      await updateConversation({ id: mockConversation.id });

      expect(mockGetFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        'UPDATE',
        expect.any(Function),
        false,
        { category: 'ai', action: '9' },
      );
      expect(mockUpdate).toHaveBeenCalledWith({ id: mockConversation.id });
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
        mockConversationName,
      );
    });

    it('returns null if conversation not found', async () => {
      mockUpdate.mockReturnValue({ data: null });

      const { data } = await updateConversation({ id: 'non-existent-id' });
      expect(data).toBeNull();
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('Update failed');
      mockUpdate.mockRejectedValue(mockError);

      await expect(
        updateConversation({ id: mockConversation.id }),
      ).rejects.toThrow('Update failed');
    });

    it('passes through errors from the update operation', async () => {
      const mockErrors = [{ message: 'Update operation failed' }];
      mockUpdate.mockReturnValue({ data: null, errors: mockErrors });

      const { data, errors } = await updateConversation({
        id: mockConversation.id,
      });
      expect(data).toBeNull();
      expect(errors).toEqual(mockErrors);
    });
  });
});
