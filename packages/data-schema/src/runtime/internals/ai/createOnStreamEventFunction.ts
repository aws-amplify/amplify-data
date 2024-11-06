// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Observable, Subscription } from 'rxjs';
import type { Conversation } from '../../../ai/ConversationType';
import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import { customOpFactory } from '../operations/custom';
import { AiAction, getCustomUserAgentDetails } from './getCustomUserAgentDetails';
import { convertItemToConversationStreamEventIR } from './conversationStreamEventDeserializers';

export const createOnStreamEventFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationId: string,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['onStreamEvent'] =>
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
      getCustomUserAgentDetails(AiAction.OnStreamEvent),
    ) as (args?: Record<string, any>) => Observable<any>;
    return subscribeOperation({ conversationId }).subscribe((data) => {
      const { event, errors } = convertItemToConversationStreamEventIR(data);
      if (errors) handler.errors(errors);
      if (event) handler.next(event);
    });
  };
