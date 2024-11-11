// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { BaseClient } from '../../../src/runtime';
import type {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';

describe('convertItemToConversation()', () => {
  const mockConversationName = 'name';
  const mockConversationId = 'conversation-id';
  it('returns a conversation', () => {
    expect(
      convertItemToConversation(
        {} as BaseClient,
        {} as ModelIntrospectionSchema,
        mockConversationId,
        '2023-06-01T12:00:00Z',
        '2023-06-02T12:00:00Z',
        mockConversationName,
        {} as SchemaModel,
        jest.fn(),
      ),
    ).toStrictEqual({
      id: mockConversationId,
      createdAt: '2023-06-01T12:00:00Z',
      updatedAt: '2023-06-02T12:00:00Z',
      onStreamEvent: expect.any(Function),
      sendMessage: expect.any(Function),
      listMessages: expect.any(Function),
      metadata: undefined,
      name: undefined,
    });
  });
});
