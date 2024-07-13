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
  conversation: any,
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  conversationRouteName: string,
  conversationMessageModel: SchemaModel,
  getInternals: ClientInternalsGetter,
): Conversation => ({
  id: conversation.id,
  onMessage: createOnMessageFunction(
    client as BaseBrowserClient,
    modelIntrospection,
    conversationRouteName,
    getInternals,
  ),
  sendMessage: createSendMessageFunction(
    conversation,
    client,
    modelIntrospection,
    conversationRouteName,
    getInternals,
  ),
  listMessages: createListMessagesFunction(
    client,
    modelIntrospection,
    conversation.id,
    conversationMessageModel,
    getInternals,
  ),
});
