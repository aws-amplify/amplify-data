// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ToolUseBlock } from "./contentBlocks";

export interface ConversationStreamTextEvent {
  contentBlockDeltaIndex: number;
  contentBlockDoneAtIndex?: never;
  text: string;
  toolUse?: never;
  stopReason?: never;
}

export interface ConversationStreamToolUseEvent {
  contentBlockDeltaIndex?: never;
  contentBlockDoneAtIndex?: never;
  text?: never;
  toolUse: ToolUseBlock;
  stopReason?: never;
}

export interface ConversationStreamDoneAtIndexEvent {
  contentBlockDoneAtIndex: number;
  contentBlockDeltaIndex?: never;
  text?: never;
  toolUse?: never;
  stopReason?: never;
}

export interface ConversationStreamTurnDoneEvent {
  contentBlockDoneAtIndex?: never;
  contentBlockDeltaIndex?: never;
  text?: never;
  toolUse?: never;
  stopReason: string;
}

export interface ConversationStreamEventBase {
  id: string;
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
}

export type ConversationStreamEvent = ConversationStreamEventBase &
  (
    | ConversationStreamTextEvent
    | ConversationStreamToolUseEvent
    | ConversationStreamDoneAtIndexEvent
    | ConversationStreamTurnDoneEvent
  );
