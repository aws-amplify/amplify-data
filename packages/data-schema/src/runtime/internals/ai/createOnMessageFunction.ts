// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Subscription } from 'rxjs';
import {
  BaseBrowserClient,
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { subscriptionFactory } from '../operations/subscription';
import type {
  ConversationMessageModel,
  ConversationSession,
} from '../../../ai/ConversationType';

export const createOnMessageFunction =
  (
    session: any,
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    messageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationSession['onMessage'] =>
  (handler): Subscription => {
    const filter = { sessionId: { eq: session.id } };
    return subscriptionFactory(
      client as BaseBrowserClient,
      modelIntrospection,
      messageModel,
      'ONCREATE',
      getInternals,
    )({ filter }).subscribe(
      ({
        content,
        createdAt,
        id,
        role,
        sessionId,
      }: ConversationMessageModel) => {
        handler({
          content: JSON.parse(content),
          createdAt,
          id,
          role,
          sessionId,
        });
      },
    );
  };
