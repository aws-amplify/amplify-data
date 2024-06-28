// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  GraphQLProviderConfig,
  SchemaModel,
} from '../../src/runtime/bridge-types';
import { createConversationSession } from '../../src/runtime/internals/ai/createConversationSession';
import { getSessionModelInstance } from '../../src/runtime/internals/ai/getSessionModelInstance';
import { generateConversationsProperty } from '../../src/runtime/internals/utils/clientProperties/generateConversationsProperty';
import { listFactory } from '../../src/runtime/internals/operations/list';

jest.mock('../../src/runtime/internals/ai/createConversationSession');
jest.mock('../../src/runtime/internals/ai/getSessionModelInstance');
jest.mock('../../src/runtime/internals/operations/list');

describe('generateConversationsProperty()', () => {
  const mockSession = { id: 'id', name: 'name' };
  const mockSession2 = { id: 'id-2', name: 'name-2' };
  const mockBaseAPIGraphQLConfig = {
    endpoint: 'endpoint',
    defaultAuthMode: 'identityPool',
  } as GraphQLProviderConfig['GraphQL'];
  const mockBaseModelIntrospection = {
    version: 1,
    models: {},
    nonModels: {},
    enums: {},
  };
  const mockConversations = {
    mathBot: {
      name: 'mathBot',
      models: {
        ConversationSessionMathBot: {} as SchemaModel,
        ConversationMessageMathBot: {} as SchemaModel,
      },
    },
    scienceBot: {
      name: 'scienceBot',
      models: {
        ConversationSessionScienceBot: {} as SchemaModel,
        ConversationMessageScienceBot: {} as SchemaModel,
      },
    },
  };
  // assert mocks
  const mockCreateConversationSession = createConversationSession as jest.Mock;
  const mockGetSessionModelInstance = getSessionModelInstance as jest.Mock;
  const mockListFactory = listFactory as jest.Mock;
  // create mocks
  const mockList = jest.fn();

  beforeAll(() => {
    mockList.mockReturnValue({ data: [mockSession, mockSession2] });
    mockListFactory.mockReturnValue(mockList);
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

  it('returns expected `conversations` object', async () => {
    mockGetSessionModelInstance.mockReturnValue(mockSession);
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: {
        ...mockBaseModelIntrospection,
        conversations: mockConversations,
      },
    } as GraphQLProviderConfig['GraphQL'];

    const conversations = generateConversationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    expect(conversations).toStrictEqual({
      mathBot: {
        startSession: expect.any(Function),
        listSessions: expect.any(Function),
      },
      scienceBot: {
        startSession: expect.any(Function),
        listSessions: expect.any(Function),
      },
    });
  });

  it('can start a session', async () => {
    mockGetSessionModelInstance.mockReturnValue(mockSession);
    const mockModelIntrospection = {
      ...mockBaseModelIntrospection,
      conversations: mockConversations,
    };
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: mockModelIntrospection,
    } as GraphQLProviderConfig['GraphQL'];

    const { mathBot } = generateConversationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    const startSessionInput = { name: 'name' };
    await mathBot.startSession(startSessionInput);

    expect(mockGetSessionModelInstance).toHaveBeenCalledWith(
      startSessionInput,
      {},
      mockModelIntrospection,
      {},
      expect.any(Function),
    );
    expect(mockCreateConversationSession).toHaveBeenCalledWith(
      mockSession,
      {},
      mockModelIntrospection,
      {},
      expect.any(Function),
    );
  });

  it('can list sessions', async () => {
    mockGetSessionModelInstance.mockReturnValue(mockSession);
    const mockModelIntrospection = {
      ...mockBaseModelIntrospection,
      conversations: mockConversations,
    };
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: mockModelIntrospection,
    } as GraphQLProviderConfig['GraphQL'];

    const { scienceBot } = generateConversationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    const sessions = await scienceBot.listSessions();

    expect(mockListFactory).toHaveBeenCalledWith(
      {},
      mockModelIntrospection,
      {},
      expect.any(Function),
    );
    expect(mockList).toHaveBeenCalled();
    expect(mockCreateConversationSession).toHaveBeenNthCalledWith(
      1,
      mockSession,
      {},
      mockModelIntrospection,
      {},
      expect.any(Function),
    );
    expect(mockCreateConversationSession).toHaveBeenNthCalledWith(
      2,
      mockSession2,
      {},
      mockModelIntrospection,
      {},
      expect.any(Function),
    );
    expect(sessions).toHaveLength(2);
  });
});
