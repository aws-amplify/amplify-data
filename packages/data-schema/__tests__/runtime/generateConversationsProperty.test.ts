// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  BaseClient,
  CustomOperation,
  GraphQLProviderConfig,
  SchemaModel,
} from '../../src/runtime/bridge-types';
import {
  conversation,
  type ConversationRoute,
} from '../../src/ai/ConversationType';
import { createCreateConversationFunction } from '../../src/runtime/internals/ai/createCreateConversationFunction';
import { createGetConversationFunction } from '../../src/runtime/internals/ai/createGetConversationFunction';
import { createListConversationsFunction } from '../../src/runtime/internals/ai/createListConversationsFunction';
import { generateConversationsProperty } from '../../src/runtime/internals/utils/clientProperties/generateConversationsProperty';

jest.mock('../../src/runtime/internals/ai/createCreateConversationFunction');
jest.mock('../../src/runtime/internals/ai/createGetConversationFunction');
jest.mock('../../src/runtime/internals/ai/createListConversationsFunction');

interface ConversationRouteMockDataModel {
  name: string;
  model: SchemaModel;
}
interface ConversationRouteMockData {
  name: string;
  conversationModel: ConversationRouteMockDataModel;
  messageModel: ConversationRouteMockDataModel;
}

const getSchemaConversation = (data: ConversationRouteMockData) => ({
  [data.name]: {
    name: data.name,
    models: {
      [data.conversationModel.name]: data.conversationModel.model,
      [data.messageModel.name]: data.messageModel.model,
    },
    nonModels: {},
    enums: {},
    conversation: {
      modelName: data.conversationModel.name,
    },
    message: {
      modelName: data.messageModel.name,
      subscribe: {} as CustomOperation,
      send: {} as CustomOperation,
    },
  },
});

describe('generateConversationsProperty()', () => {
  const mockConversation = { id: 'conversation-id' };
  const mockBaseAPIGraphQLConfig = {
    endpoint: 'endpoint',
    defaultAuthMode: 'identityPool',
  } as GraphQLProviderConfig['GraphQL'];
  const mockBaseModelIntrospection = {
    version: 1,
    models: {
      existingModel: {} as SchemaModel,
    },
    nonModels: {},
    enums: {},
  };
  const mathBotMockData: ConversationRouteMockData = {
    name: 'mathBot',
    conversationModel: {
      name: 'ConversationMathBot',
      model: {} as SchemaModel,
    },
    messageModel: {
      name: 'ConversationMessageMathBot',
      model: {} as SchemaModel,
    },
  };
  const scienceBotMockData: ConversationRouteMockData = {
    name: 'scienceBot',
    conversationModel: {
      name: 'ConversationScienceBot',
      model: {} as SchemaModel,
    },
    messageModel: {
      name: 'ConversationMessageScienceBot',
      model: {} as SchemaModel,
    },
  };
  const mockConversations = {
    ...getSchemaConversation(mathBotMockData),
    ...getSchemaConversation(scienceBotMockData),
  };
  // assert mocks
  const mockCreateCreateConversationFunction =
    createCreateConversationFunction as jest.Mock;
  const mockCreateGetConversationFunction =
    createGetConversationFunction as jest.Mock;
  const mockCreateListConversationsFunction =
    createListConversationsFunction as jest.Mock;
  // create mocks
  const mockCreateConversation = jest.fn();
  const mockGetConversation = jest.fn();
  const mockListConversation = jest.fn();

  beforeAll(() => {
    mockCreateCreateConversationFunction.mockReturnValue(
      mockCreateConversation,
    );
    mockCreateGetConversationFunction.mockReturnValue(mockGetConversation);
    mockCreateListConversationsFunction.mockReturnValue(mockListConversation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty object when there is no valid `modelIntrospection`', () => {
    const conversations = generateConversationsProperty(
      {} as BaseClient,
      mockBaseAPIGraphQLConfig,
      jest.fn(),
    );

    expect(Object.keys(conversations)).toHaveLength(0);
  });

  it('returns an empty object when there are no conversations', () => {
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: mockBaseModelIntrospection,
    } as GraphQLProviderConfig['GraphQL'];
    const conversations = generateConversationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    expect(Object.keys(conversations)).toHaveLength(0);
  });

  describe('non-empty cases', () => {
    let conversations: Record<string, ConversationRoute>;
    const mockModelIntrospection = {
      ...mockBaseModelIntrospection,
      conversations: mockConversations,
    };
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: mockModelIntrospection,
    } as GraphQLProviderConfig['GraphQL'];

    beforeAll(() => {
      conversations = generateConversationsProperty(
        {} as BaseClient,
        mockAPIGraphQLConfig,
        jest.fn(),
      );
    });

    it('returns expected `conversations` object', async () => {
      expect(conversations).toStrictEqual({
        [mathBotMockData.name]: {
          create: expect.any(Function),
          get: expect.any(Function),
          list: expect.any(Function),
        },
        [scienceBotMockData.name]: {
          create: expect.any(Function),
          get: expect.any(Function),
          list: expect.any(Function),
        },
      });

      const expected = [
        {},
        {
          ...mockModelIntrospection,
          // expect that the introspection passed during operation construction has conversation models moved to root
          models: {
            ...mockModelIntrospection.models,
            [mathBotMockData.conversationModel.name]:
              mathBotMockData.conversationModel.model,
            [mathBotMockData.messageModel.name]:
              mathBotMockData.messageModel.model,
          },
        },
        mathBotMockData.name,
        mathBotMockData.conversationModel.model,
        mathBotMockData.messageModel.model,
        expect.any(Function),
      ];

      const expected2 = [
        {},
        {
          ...mockModelIntrospection,
          // expect that the introspection passed during operation construction has conversation models moved to root
          models: {
            ...mockModelIntrospection.models,
            [scienceBotMockData.conversationModel.name]:
              scienceBotMockData.conversationModel.model,
            [scienceBotMockData.messageModel.name]:
              scienceBotMockData.messageModel.model,
          },
        },
        scienceBotMockData.name,
        scienceBotMockData.conversationModel.model,
        scienceBotMockData.messageModel.model,
        expect.any(Function),
      ];

      expect(mockCreateCreateConversationFunction).toHaveBeenCalledWith(
        ...expected,
      );
      expect(mockCreateCreateConversationFunction).toHaveBeenCalledWith(
        ...expected2,
      );
      expect(mockCreateGetConversationFunction).toHaveBeenCalledWith(
        ...expected,
      );
      expect(mockCreateGetConversationFunction).toHaveBeenCalledWith(
        ...expected2,
      );
      expect(mockCreateListConversationsFunction).toHaveBeenCalledWith(
        ...expected,
      );
      expect(mockCreateListConversationsFunction).toHaveBeenCalledWith(
        ...expected2,
      );
    });

    it('can create a conversation', async () => {
      const { mathBot } = conversations;

      await mathBot.create();

      expect(mockCreateConversation).toHaveBeenCalled();
    });

    it('can get a conversation', async () => {
      const { mathBot } = conversations;

      await mathBot.get({ id: mockConversation.id });

      expect(mockGetConversation).toHaveBeenCalledWith({
        id: mockConversation.id,
      });
    });

    it('can list conversations', async () => {
      const { mathBot } = conversations;

      await mathBot.list();

      expect(mockListConversation).toHaveBeenCalled();
    });
  });
});
