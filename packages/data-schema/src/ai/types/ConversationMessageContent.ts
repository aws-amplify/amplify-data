// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ImageBlock,
  DocumentBlock,
  ToolResultBlock,
  ToolUseBlock,
} from './contentBlocks';

export interface ConversationMessageTextContent {
  text: string;
  image?: never;
  document?: never;
  toolUse?: never;
  toolResult?: never;
}

export interface ConversationMessageImageContent {
  text?: never;
  image: ImageBlock;
  document?: never;
  toolUse?: never;
  toolResult?: never;
}

export interface ConversationMessageDocumentContent {
  text?: never;
  image?: never;
  toolUse?: never;
  toolResult?: never;
  document: DocumentBlock;
}

export interface ConversationMessageToolUseContent {
  text?: never;
  image?: never;
  document?: never;
  toolUse: ToolUseBlock;
  toolResult?: never;
}

export interface ConversationMessageToolResultContent {
  text?: never;
  image?: never;
  document?: never;
  toolUse?: never;
  toolResult: ToolResultBlock;
}

export type ConversationMessageContent =
  | ConversationMessageTextContent
  | ConversationMessageImageContent
  | ConversationMessageDocumentContent
  | ConversationMessageToolUseContent
  | ConversationMessageToolResultContent;

export type ConversationSendMessageInputContent =
  | Omit<ConversationMessageTextContent, 'toolUse'>
  | Omit<ConversationMessageImageContent, 'toolUse'>
  | Omit<ConversationMessageDocumentContent, 'toolUse'>
  | Omit<ConversationMessageToolResultContent, 'toolUse'>;
