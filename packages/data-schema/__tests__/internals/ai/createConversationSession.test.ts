// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseClient } from '../../../src/runtime';
import {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { createConversationSession } from '../../../src/runtime/internals/ai/createConversationSession';

describe('createConversationSession()', () => {
  const mockSession = {
    id: 'id',
    name: 'name',
  };
  it('returns a conversation session', () => {
    expect(
      createConversationSession(
        mockSession,
        {} as BaseClient,
        {} as ModelIntrospectionSchema,
        {} as SchemaModel,
        jest.fn(),
      ),
    ).toStrictEqual({
      id: mockSession.id,
      name: mockSession.name,
      onMessage: expect.any(Function),
      sendMessage: expect.any(Function),
      listMessages: expect.any(Function),
    });
  });
});
