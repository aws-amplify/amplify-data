import { describe, it, expect, jest } from '@jest/globals';
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

  const mockAmplify: AmplifyClass = {
    getConfig: jest.fn<() => Readonly<ResourcesConfig>>(() => ({
      API: {
        GraphQL: {
          modelIntrospection: mockModelIntrospection,
        },
      } as APIConfig,
      Auth: {},
    })),
  };

  const mockGetInternals: ClientInternalsGetter = jest.fn(() => ({
    amplifyConfig: {},
    authMode: 'apiKey' as GraphQLAuthMode,
    amplify: mockAmplify,
    authToken: 'myAuthToken',
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
        authToken: 'myAuthToken',
        query: expect.stringContaining('testQuery'),
        variables: {},
        [INTERNAL_USER_AGENT_OVERRIDE]: expect.objectContaining({
          category: 'ai',
          action: '4',
        }),
      }),
      {},
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
      expect.any(Object),
    );
  });
});
