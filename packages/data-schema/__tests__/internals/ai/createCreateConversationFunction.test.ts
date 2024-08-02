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
  const mockConversation = { id: 'conversation-id' };
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  const mockConvertItemToConversation = convertItemToConversation as jest.Mock;
  // create mocks
  const mockGet = jest.fn();

  beforeAll(async () => {
    mockConvertItemToConversation.mockImplementation((data) => data);
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

  it('returns a createConversation function', async () => {
    expect(createConversation).toBeDefined();
  });

  describe('createConversation()', () => {
    it('creates a conversation', async () => {
      const { data } = await createConversation();

      expect(mockGetFactory).toHaveBeenCalledWith(
        {},
        {},
        {},
        'CREATE',
        expect.any(Function),
      );
      expect(mockGet).toHaveBeenCalled();
      expect(data).toBe(mockConversation);
    });
  });
});
