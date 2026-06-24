// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { convertItemToConversationStreamEvent } from '../../../src/runtime/internals/ai/conversationStreamEventDeserializers';

describe('convertItemToConversationStreamEvent()', () => {
  const mockBaseEvent = {
    id: 'message-id',
    conversationId: 'conversation-id',
    associatedUserMessageId: 'associated-user-message-id',
  };

  it('includes metrics and usage in turn-done event', () => {
    const metrics = { latencyMs: 150 };
    const usage = { inputTokens: 50, outputTokens: 100, totalTokens: 150 };
    const { next, error } = convertItemToConversationStreamEvent({
      ...mockBaseEvent,
      stopReason: 'end_turn',
      metrics,
      usage,
    });

    expect(error).toBeUndefined();
    expect(next).toMatchObject({
      ...mockBaseEvent,
      stopReason: 'end_turn',
      metrics,
      usage,
    });
  });

  it('omits metrics and usage when values are undefined', () => {
    const { next, error } = convertItemToConversationStreamEvent({
      ...mockBaseEvent,
      contentBlockIndex: 0,
      contentBlockDeltaIndex: 0,
      contentBlockText: 'hello',
    });

    expect(error).toBeUndefined();
    expect(next?.metrics).toBeUndefined();
    expect(next?.usage).toBeUndefined();
  });

  it('strips null metrics and usage from text event', () => {
    const { next, error } = convertItemToConversationStreamEvent({
      ...mockBaseEvent,
      contentBlockIndex: 0,
      contentBlockDeltaIndex: 0,
      contentBlockText: 'hello',
      metrics: null,
      usage: null,
    });

    expect(error).toBeUndefined();
    expect(next).not.toHaveProperty('metrics');
    expect(next).not.toHaveProperty('usage');
  });

});
