// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseClient } from '../../../src/runtime';
import {
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../src/runtime/bridge-types';
import { createOnMessageFunction } from '../../../src/runtime/internals/ai/createOnMessageFunction';
import { subscriptionFactory } from '../../../src/runtime/internals/operations/subscription';

jest.mock('../../../src/runtime/internals/operations/subscription');

describe('createOnMessageFunction()', () => {
  const mockSession = { id: 'id', name: 'name' };
  const mockMessage = {
    content: JSON.stringify([{ text: 'foo' }]),
    createdAt: '2024-06-27T00:00:00Z',
    id: 'message-id',
    role: 'assistant',
    sessionId: mockSession.id,
  };
  // assert mocks
  const mockSubscriptionFactory = subscriptionFactory as jest.Mock;
  // create mocks
  const mockSubscription = jest.fn();
  const mockSubscribe = jest.fn();
  const mockHandler = jest.fn();

  beforeAll(() => {
    mockSubscription.mockReturnValue({ subscribe: mockSubscribe });
    mockSubscriptionFactory.mockReturnValue(mockSubscription);
    mockSubscribe.mockImplementation((subscription) => {
      subscription(mockMessage);
    });
  });

  it('returns an onMessage function', () => {
    const onMessage = createOnMessageFunction(
      mockSession,
      {} as BaseClient,
      {} as ModelIntrospectionSchema,
      {} as SchemaModel,
      jest.fn(),
    );

    expect(onMessage).toBeDefined();

    onMessage(mockHandler);

    expect(mockSubscriptionFactory).toHaveBeenCalledWith(
      {},
      {},
      {},
      'ONCREATE',
      expect.any(Function),
    );
    expect(mockSubscription).toHaveBeenCalledWith({
      filter: { sessionId: { eq: mockSession.id } },
    });
    expect(mockHandler).toHaveBeenCalledWith({
      ...mockMessage,
      content: JSON.parse(mockMessage.content),
    });
  });
});
