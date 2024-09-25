// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect, jest } from '@jest/globals';
import { getFactory } from '../../../src/runtime/internals/operations/get';
import {
  AmplifyClass,
  AmplifyServer,
  BaseBrowserClient,
  ClientInternalsGetter,
  GraphQLAuthMode,
  GraphQLOptions,
  GraphQLResult,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import {
  AiAction,
  getCustomUserAgentDetails,
  INTERNAL_USER_AGENT_OVERRIDE,
} from '../../../src/runtime/internals/ai/getCustomUserAgentDetails';

jest.mock('../../../src/runtime/internals/APIClient', () => ({
  generateGraphQLDocument: jest.fn(),
  buildGraphQLVariables: jest.fn(),
  authModeParams: jest
    .fn()
    .mockReturnValue({ authMode: 'apiKey', authToken: 'mockToken' }),
  getCustomHeaders: jest.fn(),
  flattenItems: jest.fn().mockReturnValue({ id: '1', name: 'Test Item' }),
  initializeModel: jest.fn().mockReturnValue([{ id: '1', name: 'Test Item' }]),
}));

describe('getFactory', () => {
  const mockGraphQLResult: GraphQLResult = {
    data: { getItem: { id: '1', name: 'Test Item' } },
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

  const mockContextWithGraphQLOptions: AmplifyServer.ContextSpec &
    GraphQLOptions = {
    token: { value: Symbol() },
    query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
    variables: { id: '1' },
    authMode: 'apiKey',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with context', () => {
    it('should include Custom User Agent Details when provided', async () => {
      const customUserAgentDetails = getCustomUserAgentDetails(
        AiAction.GetConversation,
      );

      const get = getFactory(
        mockClient,
        mockModelIntrospection,
        mockModel,
        'GET',
        mockGetInternals,
        false,
        customUserAgentDetails,
      );

      await get(mockContextWithGraphQLOptions, { id: '1' }, {});

      expect(mockClient.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          authMode: 'apiKey',
          authToken: 'mockToken',
          query: undefined,
          variables: undefined,
          [INTERNAL_USER_AGENT_OVERRIDE]: expect.objectContaining({
            category: 'ai',
            action: '2',
          }),
        }),
        undefined,
      );
    });

    it('should not include override symbol when Custom User Agent Details are not provided', async () => {
      const get = getFactory(
        mockClient,
        mockModelIntrospection,
        mockModel,
        'GET',
        mockGetInternals,
        true,
      );

      await get(mockContextWithGraphQLOptions, { id: '1' }, {});

      expect(mockClient.graphql).toHaveBeenCalledWith(
        mockContextWithGraphQLOptions,
        expect.not.objectContaining({
          [INTERNAL_USER_AGENT_OVERRIDE]: expect.anything(),
        }),
        undefined,
      );
    });
  });
});
