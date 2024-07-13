// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Observable, Subscription } from 'rxjs';
import type { Conversation } from '../../../ai/ConversationType';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import { customOpFactory } from '../operations/custom';

export const createOnMessageFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['onMessage'] =>
  (handler): Subscription => {
    const { conversations } = modelIntrospection;
    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
      return {} as Subscription;
    }
    const subscribeSchema =
      conversations[conversationRouteName].message.subscribe;
    const subscribeOperation = customOpFactory(
      client,
      modelIntrospection,
      'subscription',
      subscribeSchema,
      false,
      getInternals,
    ) as () => Observable<any>;
    return subscribeOperation().subscribe(
      ({ content, conversationId, createdAt, id, role }: any) => {
        handler({
          content: JSON.parse(content),
          conversationId,
          createdAt,
          id,
          role,
        });
      },
    );
  };
