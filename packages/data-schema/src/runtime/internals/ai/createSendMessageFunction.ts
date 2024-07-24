// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SingularReturnValue } from '../..';
import type {
  Conversation,
  ConversationMessage,
} from '../../../ai/ConversationType';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import { customOpFactory } from '../operations/custom';
import { convertItemToConversationMessage } from './convertItemToConversationMessage';

export const createSendMessageFunction =
  (
    conversation: any,
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['sendMessage'] =>
  // ({ aiContext, content, uiComponents }) => {
  async ({ content }) => {
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
    ) as (
      args?: Record<string, any>,
    ) => SingularReturnValue<ConversationMessage>;
    const { data, errors } = await sendOperation({
      // aiContext: JSON.stringify(aiContext),
      content: JSON.stringify(content),
      sessionId: conversation.id,
      role: 'user',
      // uiComponents,
    });
    console.log('🐶', data, errors);
    return {
      data: data ? convertItemToConversationMessage(data) : data,
      errors,
    };
  };
