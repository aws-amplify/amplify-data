// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { of } from 'rxjs';

import { customOpFactory } from '../../../src/runtime/internals/operations/custom';
import {
  AmplifyClass,
  APIConfig,
  BaseBrowserClient,
  ClientInternalsGetter,
  CustomOperation,
  CustomOperationArgument,
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

  describe('argument nullability', () => {
    const operationWithArgs = (
      args: NonNullable<CustomOperation['arguments']>,
    ): CustomOperation => ({
      ...mockOperation,
      arguments: args,
    });

    /**
     * Returns the un-awaited call so tests can distinguish a rejection from a
     * synchronous throw. `_op` is wrapped in `selfAwareAsync`, so the query and
     * mutation paths must always reject.
     */
    const call =
      (operation: CustomOperation, args: Record<string, unknown>) => () =>
        customOpFactory(
          mockClient,
          mockModelIntrospection,
          'query',
          operation,
          false,
          mockGetInternals,
        )(args);

    const invoke = async (
      operation: CustomOperation,
      args: Record<string, unknown>,
    ) => call(operation, args)();

    /**
     * `[Color!]` — a nullable list of non-null elements. The model introspection
     * schema encodes element nullability in `isRequired`, so `isRequired: true`
     * here does *not* mean the argument itself is required.
     */
    const nullableListOfRequiredElements: CustomOperationArgument = {
      name: 'colors',
      type: { enum: 'Color' },
      isArray: true,
      isRequired: true,
      isArrayNullable: true,
    };

    it.each<[string, CustomOperationArgument, string]>([
      [
        'a nullable list of non-null elements ([Color!])',
        nullableListOfRequiredElements,
        'query($colors: [Color!]) {',
      ],
      [
        'a nullable list of nullable elements ([Color])',
        {
          name: 'colors',
          type: { enum: 'Color' },
          isArray: true,
          isRequired: false,
          isArrayNullable: true,
        },
        'query($colors: [Color]) {',
      ],
      [
        'a nullable scalar (String)',
        {
          name: 'colors',
          type: 'String',
          isArray: false,
          isRequired: false,
        },
        'query($colors: String) {',
      ],
    ])(
      'does not throw when %s is omitted',
      async (_name, argDef, expectedQuery) => {
        await invoke(operationWithArgs({ colors: argDef }), {});

        expect(mockClient.graphql).toHaveBeenCalledWith(
          expect.objectContaining({
            query: expect.stringContaining(expectedQuery),
            variables: {},
          }),
          undefined,
        );
      },
    );

    it('does not throw when only the required arguments of a mixed signature are provided', async () => {
      await invoke(
        operationWithArgs({
          label: {
            name: 'label',
            type: 'String',
            isArray: false,
            isRequired: false,
          },
          colors: nullableListOfRequiredElements,
        }),
        { label: 'foo' },
      );

      expect(mockClient.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { label: 'foo' },
        }),
        undefined,
      );
    });

    it('passes a nullable list argument through as a variable when provided', async () => {
      await invoke(
        operationWithArgs({ colors: nullableListOfRequiredElements }),
        {
          colors: ['RED', 'BLUE'],
        },
      );

      expect(mockClient.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { colors: ['RED', 'BLUE'] },
        }),
        undefined,
      );
    });

    it.each<[string, CustomOperationArgument]>([
      [
        'a non-null list of non-null elements ([Color!]!)',
        {
          name: 'colors',
          type: { enum: 'Color' },
          isArray: true,
          isRequired: true,
          isArrayNullable: false,
        },
      ],
      [
        'a non-null list of nullable elements ([Color]!)',
        {
          name: 'colors',
          type: { enum: 'Color' },
          isArray: true,
          isRequired: false,
          isArrayNullable: false,
        },
      ],
      [
        // `isArrayNullable` is optional in the introspection schema; when absent
        // `outerArguments()` renders a non-null list, so the argument is required.
        'a list with an unspecified list nullability',
        {
          name: 'colors',
          type: { enum: 'Color' },
          isArray: true,
          isRequired: true,
        },
      ],
      [
        'a non-null scalar (String!)',
        {
          name: 'colors',
          type: 'String',
          isArray: false,
          isRequired: true,
        },
      ],
    ])('rejects when %s is omitted', async (_name, argDef) => {
      // `_op` is wrapped in `selfAwareAsync`, so this must reject rather than
      // throw synchronously -- a synchronous throw fails on this line.
      const pending = call(operationWithArgs({ colors: argDef }), {})();

      await expect(pending).rejects.toThrow(
        "testQuery requires arguments 'colors'",
      );

      expect(mockClient.graphql).not.toHaveBeenCalled();
    });

    /**
     * The rendered variable type and the pre-flight check must agree, so pin the
     * rendering for every list shape as well as the check above.
     */
    it.each<[string, boolean, boolean, string]>([
      ['[Color!]', true, true, 'query($colors: [Color!]) {'],
      ['[Color]', false, true, 'query($colors: [Color]) {'],
      ['[Color!]!', true, false, 'query($colors: [Color!]!) {'],
      ['[Color]!', false, false, 'query($colors: [Color]!) {'],
    ])(
      'renders %s as the variable type',
      async (_name, isRequired, isArrayNullable, expected) => {
        const argDef: CustomOperationArgument = {
          name: 'colors',
          type: { enum: 'Color' },
          isArray: true,
          isRequired,
          isArrayNullable,
        };

        await invoke(operationWithArgs({ colors: argDef }), {
          colors: ['RED'],
        });

        expect(mockClient.graphql).toHaveBeenCalledWith(
          expect.objectContaining({
            query: expect.stringContaining(expected),
          }),
          undefined,
        );
      },
    );

    it('renders a list with an unspecified list nullability as non-null', async () => {
      // The pre-flight check treats this shape as required specifically because
      // this is what gets rendered; keep the two pinned together.
      const argDef: CustomOperationArgument = {
        name: 'colors',
        type: { enum: 'Color' },
        isArray: true,
        isRequired: true,
      };

      await invoke(operationWithArgs({ colors: argDef }), {
        colors: ['RED'],
      });

      expect(mockClient.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.stringContaining('query($colors: [Color!]!) {'),
        }),
        undefined,
      );
    });

    describe('on the subscription path', () => {
      // `_opSubscription` shares `operationVariables()` but is not wrapped in
      // `selfAwareAsync`, so it throws synchronously rather than rejecting.
      const subscribe = (operation: CustomOperation) => {
        const subClient: BaseBrowserClient = {
          ...mockClient,
          graphql: jest
            .fn()
            .mockReturnValue(
              of({ data: { testQuery: 'result' } }),
            ) as jest.MockedFunction<BaseBrowserClient['graphql']>,
        };

        const customOp = customOpFactory(
          subClient,
          mockModelIntrospection,
          'subscription',
          operation,
          false,
          mockGetInternals,
        );

        return { subClient, run: () => customOp({}) };
      };

      it('does not throw when a nullable list argument is omitted', () => {
        const { subClient, run } = subscribe(
          operationWithArgs({ colors: nullableListOfRequiredElements }),
        );

        expect(run).not.toThrow();
        expect(subClient.graphql).toHaveBeenCalledWith(
          expect.objectContaining({ variables: {} }),
          undefined,
        );
      });

      it('throws when a non-null list argument is omitted', () => {
        const { subClient, run } = subscribe(
          operationWithArgs({
            colors: {
              name: 'colors',
              type: { enum: 'Color' },
              isArray: true,
              isRequired: true,
              isArrayNullable: false,
            },
          }),
        );

        expect(run).toThrow("testQuery requires arguments 'colors'");
        expect(subClient.graphql).not.toHaveBeenCalled();
      });
    });
  });
});
