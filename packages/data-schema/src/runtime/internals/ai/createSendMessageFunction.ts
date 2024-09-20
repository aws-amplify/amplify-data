// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SingularReturnValue } from '../..';
import type {
  Conversation,
  ConversationMessage,
} from '../../../ai/ConversationType';
import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  AiAction,
  Category,
} from '../../bridge-types';
import { customOpFactory } from '../operations/custom';
import { convertItemToConversationMessage } from './convertItemToConversationMessage';
import {
  serializeAiContext,
  serializeContent,
  serializeToolConfiguration,
} from './conversationMessageSerializers';

export const createSendMessageFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationId: string,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['sendMessage'] =>
  async ({ aiContext, content, toolConfiguration }) => {
    const { conversations } = modelIntrospection;

    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
      return {} as SingularReturnValue<ConversationMessage>;
    }
    const sendSchema = conversations[conversationRouteName].message.send;
    const sendOperation = customOpFactory(
      client,
      modelIntrospection,
      'mutation',
      sendSchema,
      false,
      getInternals,
      {
        category: Category.AI,
        action: AiAction.SendMessage
      },
    ) as (
      args?: Record<string, any>,
    ) => SingularReturnValue<ConversationMessage>;
    const { data, errors } = await sendOperation({
      conversationId,
      content: serializeContent(content),
      ...(aiContext && { aiContext: serializeAiContext(aiContext) }),
      ...(toolConfiguration && {
        toolConfiguration: serializeToolConfiguration(toolConfiguration),
      }),
    });
    return {
      data: data ? convertItemToConversationMessage(data) : data,
      errors,
    };
  };
