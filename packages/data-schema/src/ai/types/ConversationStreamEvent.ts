// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ToolUseBlock } from "./contentBlocks";

export interface ConversationStreamTextEvent {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
  contentBlockDeltaIndex: number;
  contentBlockDoneAtIndex?: never;
  text: string;
  toolUse?: never;
  stopReason?: never;
}

export interface ConversationStreamToolUseEvent {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
  contentBlockDeltaIndex?: never;
  contentBlockDoneAtIndex?: never;
  text?: never;
  toolUse: ToolUseBlock;
  stopReason?: never;
}

export interface ConversationStreamDoneAtIndexEvent {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
  contentBlockDoneAtIndex: number;
  contentBlockDeltaIndex?: never;
  text?: never;
  toolUse?: never;
  stopReason?: never;
}

export interface ConversationStreamTurnDoneEvent {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
  contentBlockDoneAtIndex?: never;
  contentBlockDeltaIndex?: never;
  text?: never;
  toolUse?: never;
  stopReason: string;
}

export interface ConversationStreamErrorEvent {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  errors: ConversationTurnError[]
}

export interface ConversationTurnError {
  message: string;
  errorType: string;
}

export type ConversationStreamEvent =
  | ConversationStreamTextEvent
  | ConversationStreamToolUseEvent
  | ConversationStreamDoneAtIndexEvent
  | ConversationStreamTurnDoneEvent;
