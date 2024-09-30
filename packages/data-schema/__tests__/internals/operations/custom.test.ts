// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { customOpFactory } from '../../../src/runtime/internals/operations/custom';
import {
  AmplifyClass,
  APIConfig,
  BaseBrowserClient,
  ClientInternalsGetter,
  CustomOperation,
  GraphQLResult,
  GraphQLAuthMode,
  ModelIntrospectionSchema,
  ResourcesConfig,
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

describe('customOpFactory', () => {
  const mockGraphQLResult: GraphQLResult = {
    data: { testOp: 'result' },
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

  const mockGetInternals: ClientInternalsGetter = jest.fn(() => ({
    amplifyConfig: {},
    authMode: 'apiKey' as GraphQLAuthMode,
    amplify: {} as AmplifyClass,
    authToken: 'mockToken',
    headers: {},
  }));

  const mockOperation: CustomOperation = {
    name: 'testQuery',
    type: 'String',
    isArray: false,
    isRequired: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include CustomUserAgentDetails when provided', async () => {
    const customUserAgentDetails = getCustomUserAgentDetails(
      AiAction.SendMessage,
    );

    const customOp = customOpFactory(
      mockClient,
      mockModelIntrospection,
      'query',
      mockOperation,
      false,
      mockGetInternals,
      customUserAgentDetails,
    );

    await customOp({});

    expect(mockClient.graphql).toHaveBeenCalledWith(
      expect.objectContaining({
        authMode: 'apiKey',
        authToken: 'mockToken',
        query: expect.stringContaining('testQuery'),
        variables: {},
        [INTERNAL_USER_AGENT_OVERRIDE]: expect.objectContaining({
          category: 'ai',
          action: '5',
        }),
      }),
      undefined,
    );
  });

  it('should not include override symbol when CustomUserAgentDetails are not provided', async () => {
    const customOp = customOpFactory(
      mockClient,
      mockModelIntrospection,
      'query',
      mockOperation,
      false,
      mockGetInternals,
    );

    await customOp({});

    expect(mockClient.graphql).toHaveBeenCalledWith(
      expect.not.objectContaining({
        [INTERNAL_USER_AGENT_OVERRIDE]: expect.anything(),
      }),
      undefined,
    );
  });
});
