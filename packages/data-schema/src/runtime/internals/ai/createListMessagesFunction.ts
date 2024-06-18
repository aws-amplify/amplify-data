// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { listFactory } from '../operations/list';
import type {
  ConversationMessage,
  ConversationMessageModel,
  ConversationSession,
} from '../../../ai/ConversationType';

export const createListMessagesFunction =
  (
    session: any,
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    messageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationSession['listMessages'] =>
  async (): Promise<ConversationMessage[]> => {
    const filter = { sessionId: { eq: session.id } };
    const list = listFactory(
      client,
      modelIntrospection,
      messageModel,
      getInternals,
    ) as (args?: Record<string, any>) => Promise<any>;
    const { data } = await list({ filter });
    return data.map(
      ({
        content,
        createdAt,
        id,
        role,
        sessionId,
      }: ConversationMessageModel) => ({
        content: JSON.parse(content),
        createdAt,
        id,
        role,
        sessionId,
      }),
    );
  };
