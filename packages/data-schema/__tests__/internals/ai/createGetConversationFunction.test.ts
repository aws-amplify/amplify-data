// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';
import { createGetConversationFunction } from '../../../src/runtime/internals/ai/createGetConversationFunction';
import { getFactory } from '../../../src/runtime/internals/operations/get';

jest.mock('../../../src/runtime/internals/ai/convertItemToConversation');
jest.mock('../../../src/runtime/internals/operations/get');

describe('createGetConversationFunction()', () => {
  let getConversation: ConversationRoute['get'];
  const mockConversationName = 'conversation-name';
  const mockConversation = { id: 'conversation-id' };
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  const mockConvertItemToConversation = convertItemToConversation as jest.Mock;
  // create mocks
  const mockGet = jest.fn();

  beforeAll(async () => {
    mockGet.mockReturnValue({ data: mockConversation });
    mockGetFactory.mockReturnValue(mockGet);
    getConversation = await createGetConversationFunction(
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      mockConversationName,
      {} as SchemaModel,
      {} as SchemaModel,
      jest.fn(),
    );
  });

  it('returns a getConversation function', async () => {
    expect(getConversation).toBeDefined();
  });

  describe('getConversation()', () => {
    it('gets a conversation', async () => {
      await getConversation({ id: mockConversation.id });

      expect(mockGetFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        'READ',
        expect.any(Function),
      );
      expect(mockGet).toHaveBeenCalledWith({ id: mockConversation.id });
      expect(mockConvertItemToConversation).toHaveBeenCalledWith(
        {},
        {},
        mockConversation.id,
        mockConversationName,
        {},
        expect.any(Function),
      );
    });

    it('returns null if not found', async () => {
      mockGet.mockReturnValue({ data: null });

      const { data } = await getConversation({ id: mockConversation.id });
      expect(data).toBeNull();
    });
  });
});
