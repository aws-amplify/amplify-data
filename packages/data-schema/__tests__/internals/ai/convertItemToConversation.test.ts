// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema, SchemaModel } from '../../../src/runtime/bridge-types';
import { convertItemToConversation } from '../../../src/runtime/internals/ai/convertItemToConversation';

describe('convertItemToConversation()', () => {
  const mockConversationName = 'name';
  const mockConversation = { id: 'conversation-id' };
  it('returns a conversation', () => {
    expect(
      convertItemToConversation(
        mockConversation,
        {} as BaseClient,
        {} as ModelIntrospectionSchema,
        mockConversationName,
        {} as SchemaModel,
        jest.fn(),
      ),
    ).toStrictEqual({
      id: mockConversation.id,
      onMessage: expect.any(Function),
      sendMessage: expect.any(Function),
      listMessages: expect.any(Function),
    });
  });
});
