// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  Conversation,
  ConversationMessage,
  ConversationStreamEvent,
} from '../../ai/ConversationType';
import type { ClientSchemaProperty } from '../Core';

export interface ClientConversation
  extends Pick<ClientSchemaProperty, '__entityType'> {
  __entityType: 'customConversation';
  type: Conversation;
  messageType: ConversationMessage;
  streamEventType: ConversationStreamEvent;
}
