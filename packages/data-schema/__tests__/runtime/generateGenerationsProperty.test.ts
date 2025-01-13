// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  GraphQLProviderConfig,
  SchemaModel,
} from '../../src/runtime/bridge-types';
import { generateGenerationsProperty } from '../../src/runtime/internals/utils/clientProperties/generateGenerationsProperty';
import { customOpFactory } from '../../src/runtime/internals/operations/custom';

jest.mock('../../src/runtime/internals/operations/custom');

describe('generateGenerationsProperty()', () => {
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
  const mockGenerations = {
    makeRecipe: {
      name: 'makeRecipe',
      isArray: false,
      type: { nonModel: 'Recipe' },
      isRequired: false,
    },
    makeHaiku: {
      name: 'makeHaiku',
      isArray: false,
      type: { nonModel: 'Haiku' },
      isRequired: false,
    },
  };
  // assert mocks
  const mockCustomOpFactory = customOpFactory as jest.Mock;
  // create mocks
  const mockCustomOp = jest.fn();

  beforeAll(() => {
    mockCustomOpFactory.mockReturnValue(mockCustomOp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty object when there is no valid `modelIntrospection`', () => {
    const generations = generateGenerationsProperty(
      {} as BaseClient,
      mockBaseAPIGraphQLConfig,
      jest.fn(),
    );

    expect(Object.keys(generations)).toHaveLength(0);
  });

  it('returns an empty object when there are no generations', () => {
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: mockBaseModelIntrospection,
    } as GraphQLProviderConfig['GraphQL'];
    const generations = generateGenerationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    expect(Object.keys(generations)).toHaveLength(0);
  });

  it('returns expected `generations` object', async () => {
    const mockAPIGraphQLConfig = {
      ...mockBaseAPIGraphQLConfig,
      modelIntrospection: {
        ...mockBaseModelIntrospection,
        generations: mockGenerations,
      },
    } as GraphQLProviderConfig['GraphQL'];

    const generations = generateGenerationsProperty(
      {} as BaseClient,
      mockAPIGraphQLConfig,
      jest.fn(),
    );

    expect(generations).toStrictEqual({
      makeRecipe: mockCustomOp,
      makeHaiku: mockCustomOp,
    });
  });
});
