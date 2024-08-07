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
        mockConversationName,
        {} as SchemaModel,
        jest.fn(),
      ),
    ).toStrictEqual({
      id: mockConversationId,
      onMessage: expect.any(Function),
      sendMessage: expect.any(Function),
      listMessages: expect.any(Function),
    });
  });
});
