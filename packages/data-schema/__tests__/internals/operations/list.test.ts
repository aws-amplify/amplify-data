// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect, jest } from '@jest/globals';
import { listFactory } from '../../../src/runtime/internals/operations/list';
import {
  AiAction,
  AmplifyServer,
  AmplifyClass,
  BaseBrowserClient,
  Category,
  ClientInternalsGetter,
  CustomUserAgentDetails,
  GraphQLResult,
  GraphQLAuthMode,
  INTERNAL_USER_AGENT_OVERRIDE,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';

jest.mock('../../../src/runtime/internals/APIClient', () => ({
  generateGraphQLDocument: jest.fn(),
  buildGraphQLVariables: jest.fn(),
  authModeParams: jest
    .fn()
    .mockReturnValue({ authMode: 'apiKey', authToken: 'mockToken' }),
  getCustomHeaders: jest.fn(),
  flattenItems: jest.fn(),
  initializeModel: jest.fn(),
}));

describe('listFactory', () => {
  const mockGraphQLResult: GraphQLResult = {
    data: { listItems: { items: [] } },
  };
  const mockClient: BaseBrowserClient = {
    graphql: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockGraphQLResult),
      ) as jest.MockedFunction<BaseBrowserClient['graphql']>,
    cancel: jest.fn().mockReturnValue(true) as jest.MockedFunction<
      BaseBrowserClient['cancel']
    >,
    isCancelError: jest.fn().mockReturnValue(false) as jest.MockedFunction<
      BaseBrowserClient['isCancelError']
    >,
  };

  const mockModelIntrospection: ModelIntrospectionSchema = {
    models: {},
    nonModels: {},
    version: 1,
    enums: {},
  };

  const mockModel: SchemaModel = {
    name: 'TestModel',
    pluralName: 'TestModels',
    fields: {},
    syncable: true,
    primaryKeyInfo: {
      isCustomPrimaryKey: false,
      primaryKeyFieldName: 'id',
      sortKeyFieldNames: [],
    },
  };

  const mockGetInternals: ClientInternalsGetter = jest.fn(() => ({
    amplifyConfig: {},
    authMode: 'apiKey' as GraphQLAuthMode,
    amplify: {} as AmplifyClass,
    authToken: 'myAuthToken',
    headers: {},
  }));

  const mockContext: AmplifyServer.ContextSpec = {
    token: { value: Symbol() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include Custom User Agent Details when provided', async () => {
    const customUserAgentDetails: CustomUserAgentDetails = {
      category: Category.AI,
      action: AiAction.ListConversations,
    };

    const list = listFactory(
      mockClient,
      mockModelIntrospection,
      mockModel,
      mockGetInternals,
      false,
      customUserAgentDetails,
    );

    await list(mockContext, {});

    expect(mockClient.graphql).toHaveBeenCalledWith(
      expect.objectContaining({
        authMode: 'apiKey',
        authToken: 'mockToken',
        query: undefined,
        variables: undefined,
        [INTERNAL_USER_AGENT_OVERRIDE]: expect.objectContaining({
          category: Category.AI,
          action: '3',
        }),
      }),
      undefined,
    );
  });

  it('should not include override symbol when Custom User Agent Details are not provided', async () => {
    const list = listFactory(
      mockClient,
      mockModelIntrospection,
      mockModel,
      mockGetInternals,
      true,
    );

    await list(mockContext, {});

    expect(mockClient.graphql).toHaveBeenCalledWith(
      mockContext,
      expect.not.objectContaining({
        [INTERNAL_USER_AGENT_OVERRIDE]: expect.anything(),
      }),
      undefined,
    );
  });
});
