// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Conversation } from '../../../ai/ConversationType';
import type {
  BaseBrowserClient,
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { createListMessagesFunction } from './createListMessagesFunction';
import { createOnMessageFunction } from './createOnMessageFunction';
import { createSendMessageFunction } from './createSendMessageFunction';

export const convertItemToConversation = (
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  conversationId: string,
  conversationRouteName: string,
  conversationMessageModel: SchemaModel,
  getInternals: ClientInternalsGetter,
): Conversation => {
  if (!conversationId) {
    throw new Error(
      `An error occurred converting a ${conversationRouteName} conversation: Missing ID`,
    );
  }
  return {
    id: conversationId,
    onMessage: createOnMessageFunction(
      client as BaseBrowserClient,
      modelIntrospection,
      conversationId,
      conversationRouteName,
      getInternals,
    ),
    sendMessage: createSendMessageFunction(
      client,
      modelIntrospection,
      conversationId,
      conversationRouteName,
      getInternals,
    ),
    listMessages: createListMessagesFunction(
      client,
      modelIntrospection,
      conversationId,
      conversationMessageModel,
      getInternals,
    ),
  };
};
