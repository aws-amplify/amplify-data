// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ImageBlock, ToolResultBlock, ToolUseBlock } from './contentBlocks';

export interface ConversationMessageTextContent {
  text: string;
  image?: never;
  toolUse?: never;
  toolResult?: never;
}

export interface ConversationMessageImageContent {
  text?: never;
  image: ImageBlock;
  toolUse?: never;
  toolResult?: never;
}

export interface ConversationMessageToolUseContent {
  text?: never;
  image?: never;
  toolUse: ToolUseBlock;
  toolResult?: never;
}

export interface ConversationMessageToolResultContent {
  text?: never;
  image?: never;
  toolUse?: never;
  toolResult: ToolResultBlock;
}

export type ConversationMessageContent =
  | ConversationMessageTextContent
  | ConversationMessageImageContent
  | ConversationMessageToolUseContent
  | ConversationMessageToolResultContent;

export type ConversationSendMessageInputContent =
  | Omit<ConversationMessageTextContent, 'toolUse'>
  | Omit<ConversationMessageImageContent, 'toolUse'>
  | Omit<ConversationMessageToolResultContent, 'toolUse'>;
