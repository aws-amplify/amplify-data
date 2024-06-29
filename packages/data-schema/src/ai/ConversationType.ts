// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Subscription } from 'rxjs';
import { type Brand, brand } from '../util';

const brandName = 'conversationCustomOperation';

type DocumentType =
  | null
  | boolean
  | number
  | string
  | DocumentType[]
  | {
      [key: string]: DocumentType;
    };

interface ConversationMessageContentBaseType {
  text?: never;
  image?: never;
  toolUse?: never;
  toolResult?: never;
}

interface ConversationMessageToolResultsContentBaseType {
  text?: never;
  image?: never;
  json?: never;
}

interface ConversationMessageTextContentBaseType {
  text: string;
}

interface ConversationMessageImageContentBaseType {
  image: {
    format: 'gif' | 'jpeg' | 'png' | 'webp';
    source: {
      bytes: Uint8Array;
    };
  };
}

interface ConversationMessageTextContentType
  extends Omit<ConversationMessageContentBaseType, 'text'>,
    ConversationMessageTextContentBaseType {}

interface ConversationMessageImageContentType
  extends Omit<ConversationMessageContentBaseType, 'image'>,
    ConversationMessageImageContentBaseType {}

interface ConversationMessageToolUseContentType
  extends Omit<ConversationMessageContentBaseType, 'toolUse'> {
  toolUse: {
    toolUseId: string;
    name: string;
    input: DocumentType;
  };
}

interface ConversationMessageToolResultsContentType
  extends Omit<ConversationMessageContentBaseType, 'toolResult'> {
  toolResult: {
    toolUseId: string;
    content: ConversationMessageToolResultsContent[];
    status?: 'success' | 'error';
  };
}

interface ConversationMessageToolResultsTextContentType
  extends Omit<ConversationMessageToolResultsContentBaseType, 'text'>,
    ConversationMessageTextContentBaseType {}

interface ConversationMessageToolResultsImageContentType
  extends Omit<ConversationMessageToolResultsContentBaseType, 'image'>,
    ConversationMessageImageContentBaseType {}

interface ConversationMessageToolResultsJsonContentType
  extends Omit<ConversationMessageToolResultsContentBaseType, 'json'> {
  json: DocumentType;
}

type ConversationMessageToolResultsContent =
  | ConversationMessageToolResultsTextContentType
  | ConversationMessageToolResultsImageContentType
  | ConversationMessageToolResultsJsonContentType;

type ConversationMessageContent =
  | ConversationMessageTextContentType
  | ConversationMessageImageContentType
  | ConversationMessageToolUseContentType
  | ConversationMessageToolResultsContentType;

export interface StartSessionInput {
  id?: string;
  name?: string;
}

export interface Conversation {
  startSession: (input?: StartSessionInput) => Promise<ConversationSession>;
  listSessions: () => Promise<ConversationSession[]>;
}

interface SendMessageInput {
  content: ConversationMessage['content'];
}

type OnMessageHandler = (message: ConversationMessage) => void;

export interface ConversationSession {
  id: string;
  name?: string;
  onMessage: (handler: OnMessageHandler) => Subscription;
  sendMessage: (input: SendMessageInput) => Promise<void>;
  listMessages: () => Promise<ConversationMessage[]>;
}

export interface ConversationMessageModel {
  content: string;
  createdAt: string;
  id: string;
  role: 'user' | 'assistant';
  sessionId: string;
}

export interface ConversationMessage
  extends Omit<ConversationMessageModel, 'content'> {
  content: ConversationMessageContent[];
}

export interface ConversationType extends Brand<typeof brandName> {}

function _conversation() {
  return {
    ...brand(brandName),
  } as ConversationType;
}

export function conversation() {
  return _conversation();
}
