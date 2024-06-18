// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseBrowserClient,
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import type { ConversationSession } from '../../../ai/ConversationType';
import { createListMessagesFunction } from './createListMessagesFunction';
import { createOnMessageFunction } from './createOnMessageFunction';
import { createSendMessageFunction } from './createSendMessageFunction';

export const createConversationSession = (
  session: any,
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  messageModel: SchemaModel,
  getInternals: ClientInternalsGetter,
): ConversationSession => {
  return {
    id: session.id,
    name: session.name,
    onMessage: createOnMessageFunction(
      session,
      client as BaseBrowserClient,
      modelIntrospection,
      messageModel,
      getInternals,
    ),
    sendMessage: createSendMessageFunction(
      session,
      client,
      modelIntrospection,
      messageModel,
      getInternals,
    ),
    listMessages: createListMessagesFunction(
      session,
      client,
      modelIntrospection,
      messageModel,
      getInternals,
    ),
  };
};
