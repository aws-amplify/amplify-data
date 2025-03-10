// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema } from '../../../src/runtime/bridge-types';
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';
import { createOnStreamEventFunction } from '../../../src/runtime/internals/ai/createOnStreamEventFunction';
import { convertItemToConversationStreamEvent } from '../../../src/runtime/internals/ai/conversationStreamEventDeserializers';
jest.mock('../../../src/runtime/internals/ai/conversationStreamEventDeserializers');
jest.mock('../../../src/runtime/internals/operations/custom');

describe('createOnStreamEventFunction()', () => {
  let onStreamEvent: Conversation['onStreamEvent'];
  const mockConversationName = 'conversation-name';
  const mockConversationId = 'conversation-id';
  const mockRole = 'user';
  const mockMessageId = 'message-id';
  const mockAssociatedUserMessageId = 'associated-user-message-id';
  const mockContentBlockIndex = 0;
  const mockContentBlockDeltaIndex = 0;
  const mockText = 'hello';
  const mockStreamEvent = {
    associatedUserMessageId: mockAssociatedUserMessageId,
    contentBlockIndex: mockContentBlockIndex,
    contentBlockDeltaIndex: mockContentBlockDeltaIndex,
    text: mockText,
    conversationId: mockConversationId,
    id: mockMessageId,
    role: mockRole,
  };
  const mockError = { message: 'error message', errorType: 'errorType' };
  const mockStreamEventError = {
    errors: [mockError],
    id: mockMessageId,
    conversationId: mockConversationId,
    associatedUserMessageId: mockAssociatedUserMessageId,
  };
  const mockConversationSchema = { message: { subscribe: {} } };
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: mockConversationSchema },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  const mockConvertItemToConversationStreamEvent =
  convertItemToConversationStreamEvent as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();
  const mockSubscribe = jest.fn();
  const mockHandler = {
    next: jest.fn(),
    error: jest.fn(),
  };

  beforeAll(async () => {
    mockCustomOp.mockReturnValue({ subscribe: mockSubscribe });
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
    onStreamEvent = await createOnStreamEventFunction(
      {} as BaseClient,
      mockModelIntrospectionSchema,
      mockConversationId,
      mockConversationName,
      jest.fn(),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a onStreamEvent function', async () => {
    expect(onStreamEvent).toBeDefined();
  });

  describe('onStreamEvent()', () => {
    it('triggers next handler', async () => {
      mockConvertItemToConversationStreamEvent.mockImplementation((next) => ({ next }));
      mockSubscribe.mockImplementation((subscription) => {
        subscription(mockStreamEvent);
      });
      const expectedData = {
        associatedUserMessageId: mockAssociatedUserMessageId,
        contentBlockIndex: mockContentBlockIndex,
        contentBlockDeltaIndex: mockContentBlockDeltaIndex,
        text: mockText,
        conversationId: mockConversationId,
        id: mockMessageId,
        role: mockRole,
      };
      const expectedUndefinedFields = {
        contentBlockDoneAtIndex: undefined,
        toolUse: undefined,
        stopReason: undefined,
      };
      onStreamEvent(mockHandler);

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'subscription',
        mockConversationSchema.message.subscribe,
        false,
        expect.any(Function),
        { action: '7', category: 'ai' },
      );
      expect(mockCustomOp).toHaveBeenCalledWith({
        conversationId: mockConversationId,
      });
      expect(mockConvertItemToConversationStreamEvent).toHaveBeenCalledWith(
        { ...expectedData, ...expectedUndefinedFields },
      );
      expect(mockHandler.next).toHaveBeenCalledWith(expectedData);
    });

    it('triggers errors handler', async () => {
      mockConvertItemToConversationStreamEvent.mockImplementation((error) => ({ error }));
      mockSubscribe.mockImplementation((subscription) => {
        subscription(mockStreamEventError);
      });
      const expectedError = {
        id: mockMessageId,
        associatedUserMessageId: mockAssociatedUserMessageId,
        conversationId: mockConversationId,
        errors: [mockError],
      };
      const expectedUndefinedFields = {
        contentBlockDoneAtIndex: undefined,
        toolUse: undefined,
        stopReason: undefined,
        contentBlockIndex: undefined,
        contentBlockDeltaIndex: undefined,
        text: undefined,
        role: undefined,
      };
      onStreamEvent(mockHandler);
      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'subscription',
        mockConversationSchema.message.subscribe,
        false,
        expect.any(Function),
        { action: '7', category: 'ai' },
      );
      expect(mockCustomOp).toHaveBeenCalledWith({
        conversationId: mockConversationId,
      });
      expect(mockConvertItemToConversationStreamEvent).toHaveBeenCalledWith(
        { ...expectedError, ...expectedUndefinedFields },
      );
      expect(mockHandler.error).toHaveBeenCalledWith(expectedError);
    });
  });
});
