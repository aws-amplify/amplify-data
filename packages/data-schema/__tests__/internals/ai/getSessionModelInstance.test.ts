// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseClient } from '../../../src/runtime';
import {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { getSessionModelInstance } from '../../../src/runtime/internals/ai/getSessionModelInstance';
import { getFactory } from '../../../src/runtime/internals/operations/get';
import { listFactory } from '../../../src/runtime/internals/operations/list';

jest.mock('../../../src/runtime/internals/operations/get');
jest.mock('../../../src/runtime/internals/operations/list');

describe('getSessionModelInstance()', () => {
  const mockSessionInput = { name: 'name' };
  const mockSession = { id: 'id', name: 'name' };
  const newSession = { id: 'new-id', name: mockSessionInput.name };
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  const mockListFactory = listFactory as jest.Mock;
  // create mocks
  const mockGet = jest.fn();
  const mockList = jest.fn();

  beforeAll(() => {
    mockGet.mockReturnValue({ data: newSession });
    mockList.mockReturnValue({ data: [mockSession] });
    mockListFactory.mockReturnValue(mockList);
    mockGetFactory.mockReturnValue(mockGet);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a matched session instance', async () => {
    const instance = await getSessionModelInstance(
      mockSessionInput,
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      {} as SchemaModel,
      jest.fn(),
    );

    expect(mockListFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      expect.any(Function),
    );
    expect(mockList).toHaveBeenCalledWith({
      filter: {
        or: [{ name: { eq: mockSessionInput.name } }, { id: { eq: null } }],
      },
    });
    expect(instance).toBe(mockSession);
  });

  it('returns a created session instance', async () => {
    mockList.mockReturnValue({ data: [] });
    const instance = await getSessionModelInstance(
      mockSessionInput,
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      {} as SchemaModel,
      jest.fn(),
    );

    expect(mockListFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      expect.any(Function),
    );
    expect(mockList).toHaveBeenCalledWith({
      filter: {
        or: [{ name: { eq: mockSessionInput.name } }, { id: { eq: null } }],
      },
    });
    expect(mockGetFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      'CREATE',
      expect.any(Function),
    );
    expect(mockGet).toHaveBeenCalledWith({ name: mockSessionInput.name });
    expect(instance).toBe(newSession);
  });
});
