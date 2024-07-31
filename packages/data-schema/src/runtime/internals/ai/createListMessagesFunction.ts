// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  Conversation,
  ConversationMessage,
} from '../../../ai/ConversationType';
import type { ListReturnValue } from '../../../runtime/client';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { listFactory } from '../operations/list';
import { convertItemToConversationMessage } from './convertItemToConversationMessage';

export const createListMessagesFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationId: string,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): Conversation['listMessages'] =>
  async (input) => {
    const list = listFactory(
      client,
      modelIntrospection,
      conversationMessageModel,
      getInternals,
    ) as (args?: Record<string, any>) => ListReturnValue<ConversationMessage>;
    const { data, nextToken, errors } = await list({
      ...input,
      filter: { sessionId: { eq: conversationId } },
    });
    return {
      data: data.map((item: any) => convertItemToConversationMessage(item)),
      nextToken,
      errors,
    };
  };
