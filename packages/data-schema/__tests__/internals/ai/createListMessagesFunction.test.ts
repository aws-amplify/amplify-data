// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseClient } from '../../../src/runtime';
import {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { createListMessagesFunction } from '../../../src/runtime/internals/ai/createListMessagesFunction';
import { listFactory } from '../../../src/runtime/internals/operations/list';

jest.mock('../../../src/runtime/internals/operations/list');

describe('createListMessagesFunction()', () => {
  const mockSession = { id: 'id', name: 'name' };
  const mockMessage = {
    content: JSON.stringify([{ text: 'foo' }]),
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id',
    role: 'assistant',
    sessionId: mockSession.id,
  };
  const mockMessage2 = {
    content: JSON.stringify([{ text: 'bar' }]),
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id-2',
    role: 'assistant',
    sessionId: mockSession.id,
  };
  // assert mocks
  const mockListFactory = listFactory as jest.Mock;
  // create mocks
  const mockList = jest.fn();

  beforeAll(() => {
    mockList.mockReturnValue({ data: [mockMessage, mockMessage2] });
    mockListFactory.mockReturnValue(mockList);
  });

  it('returns a listMessage function', async () => {
    const listMessages = createListMessagesFunction(
      mockSession,
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      {} as SchemaModel,
      jest.fn(),
    );

    expect(listMessages).toBeDefined();

    const messages = await listMessages();

    expect(mockListFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      expect.any(Function),
    );
    expect(mockList).toHaveBeenCalledWith({
      filter: { sessionId: { eq: mockSession.id } },
    });
    expect(messages).toStrictEqual([
      {
        ...mockMessage,
        content: JSON.parse(mockMessage.content),
      },
      {
        ...mockMessage2,
        content: JSON.parse(mockMessage2.content),
      },
    ]);
  });
});
