// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseClient } from '../../../src/runtime';
import {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { createSendMessageFunction } from '../../../src/runtime/internals/ai/createSendMessageFunction';
import { getFactory } from '../../../src/runtime/internals/operations/get';

jest.mock('../../../src/runtime/internals/operations/get');

describe('createSendMessageFunction()', () => {
  const mockSession = { id: 'id', name: 'name' };
  const mockContent = [{ text: 'foo' }];
  // assert mocks
  const mockGetFactory = getFactory as jest.Mock;
  // create mocks
  const mockGet = jest.fn();

  beforeAll(() => {
    mockGetFactory.mockReturnValue(mockGet);
  });

  it('returns a sendMessage function', async () => {
    const sendMessage = createSendMessageFunction(
      mockSession,
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      {} as SchemaModel,
      jest.fn(),
    );

    expect(sendMessage).toBeDefined();

    await sendMessage({ content: mockContent });

    expect(mockGetFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      'CREATE',
      expect.any(Function),
    );
    expect(mockGet).toHaveBeenCalledWith({
      content: JSON.stringify(mockContent),
      role: 'user',
      sessionId: mockSession.id,
    });
  });
});
