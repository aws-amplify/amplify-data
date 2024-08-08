// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../src/ai/ConversationType';
import type { BaseClient } from '../../../src/runtime';
import type { ModelIntrospectionSchema } from '../../../src/runtime/bridge-types';
import { convertItemToConversationMessage } from '../../../src/runtime/internals/ai/convertItemToConversationMessage';
import { createSendMessageFunction } from '../../../src/runtime/internals/ai/createSendMessageFunction';
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';
import {
  serializeAiContext,
  serializeContent,
  serializeToolConfiguration,
} from '../../../src/runtime/internals/ai/conversationMessageSerializers';

jest.mock('../../../src/runtime/internals/ai/conversationMessageSerializers');
jest.mock('../../../src/runtime/internals/ai/convertItemToConversationMessage');
jest.mock('../../../src/runtime/internals/operations/custom');

describe('createSendMessageFunction()', () => {
  let sendMessage: Conversation['sendMessage'];
  const mockContent = [{ text: 'foo' }];
  const mockAiContext = { location: 'Seattle, WA' };
  const mockSerializedAiContext = JSON.stringify(mockAiContext);
  const mockToolName = 'myTool';
  const mockToolConfiguration = {
    tools: {
      [mockToolName]: {
        inputSchema: {
          json: {},
        },
      },
    },
  };
  const mockSerializedToolConfiguration = {
    tools: [
      {
        toolSpec: {
          name: mockToolName,
          inputSchema: {
            json: JSON.stringify({}),
          },
        },
      },
    ],
  };
  const mockConversationName = 'conversation-name';
  const mockConversationId = 'conversation-id';
  const mockMessage = {
    content: [{ text: 'foo' }],
    conversationId: mockConversationId,
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id',
    role: 'user',
  };
  const mockConversationSchema = { message: { send: {} } };
  const mockModelIntrospectionSchema = {
    conversations: { [mockConversationName]: mockConversationSchema },
  } as unknown as ModelIntrospectionSchema;
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  const mockConvertItemToConversationMessage =
    convertItemToConversationMessage as jest.Mock;
  const mockSerializeAiContext = serializeAiContext as jest.Mock;
  const mockSerializeContent = serializeContent as jest.Mock;
  const mockSerializeToolConfiguration =
    serializeToolConfiguration as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();

  beforeAll(async () => {
    mockConvertItemToConversationMessage.mockImplementation((data) => data);
    mockCustomOp.mockReturnValue({ data: mockMessage });
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
    mockSerializeAiContext.mockReturnValue(mockSerializedAiContext);
    mockSerializeContent.mockImplementation((content) => content);
    mockSerializeToolConfiguration.mockReturnValue(
      mockSerializedToolConfiguration,
    );
    sendMessage = await createSendMessageFunction(
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

  it('returns a sendMessage function', async () => {
    expect(sendMessage).toBeDefined();
  });

  describe('sendMessage()', () => {
    it('sends a message', async () => {
      const { data } = await sendMessage({
        aiContext: mockAiContext,
        content: mockContent,
        toolConfiguration: mockToolConfiguration,
      });

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'mutation',
        mockConversationSchema.message.send,
        false,
        expect.any(Function),
      );
      expect(mockSerializeAiContext).toHaveBeenCalledWith(mockAiContext);
      expect(mockSerializeContent).toHaveBeenCalledWith(mockContent);
      expect(mockSerializeToolConfiguration).toHaveBeenCalledWith(
        mockToolConfiguration,
      );
      expect(mockCustomOp).toHaveBeenCalledWith({
        aiContext: mockSerializedAiContext,
        content: mockContent,
        conversationId: mockConversationId,
        toolConfiguration: mockSerializedToolConfiguration,
      });
      expect(data).toBe(mockMessage);
    });

    it('does not send optional properties if undefined', async () => {
      const { data } = await sendMessage({ content: mockContent });

      expect(mockCustomOpFactory).toHaveBeenCalledWith(
        {},
        mockModelIntrospectionSchema,
        'mutation',
        mockConversationSchema.message.send,
        false,
        expect.any(Function),
      );
      expect(mockSerializeAiContext).not.toHaveBeenCalled();
      expect(mockSerializeToolConfiguration).not.toHaveBeenCalled();
      expect(mockCustomOp).toHaveBeenCalledWith({
        content: mockContent,
        conversationId: mockConversationId,
      });
      expect(data).toBe(mockMessage);
    });
  });
});
