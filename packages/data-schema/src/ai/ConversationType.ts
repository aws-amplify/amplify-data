// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Subscription } from 'rxjs';
import type { DefineFunction } from '@aws-amplify/data-schema-types';
import type { ListReturnValue, SingularReturnValue } from '../runtime/client';
import { type Brand, brand } from '../util';
import type { RefType } from '../RefType';
import { AiModel } from './AiModelType';
import {
  ConversationMessageContent,
  ConversationSendMessageInputContent,
} from './types/ConversationMessageContent';
import { ToolConfiguration } from './types/ToolConfiguration';

export const brandName = 'conversationCustomOperation';

// conversation message types
export interface ConversationMessage {
  content: ConversationMessageContent[];
  conversationId: string;
  createdAt: string;
  id: string;
  role: 'user' | 'assistant';
}

// conversation route types
interface ConversationRouteGetInput {
  id: string;
}

interface ConversationRouteListInput {
  limit?: number;
  nextToken?: string | null;
}

export interface ConversationRoute {
  create: () => SingularReturnValue<Conversation>;
  get: (input: ConversationRouteGetInput) => SingularReturnValue<Conversation>;
  list: (input?: ConversationRouteListInput) => ListReturnValue<Conversation>;
}

// conversation types
interface ConversationSendMessageInput {
  content: ConversationSendMessageInputContent[];
  aiContext?: string | Record<string, any>;
  toolConfiguration?: ToolConfiguration;
}

interface ConversationListMessagesInput {
  limit?: number;
  nextToken?: string | null;
}

type ConversationOnMessageHandler = (message: ConversationMessage) => void;

export interface Conversation {
  id: string;
  sendMessage: (
    input: ConversationSendMessageInput,
  ) => SingularReturnValue<ConversationMessage>;
  listMessages: (
    input?: ConversationListMessagesInput,
  ) => ListReturnValue<ConversationMessage>;
  onMessage: (handler: ConversationOnMessageHandler) => Subscription;
}

// schema definition input
export interface ToolDefinition {
  query: RefType<any>;
  description: string;
}

export interface InferenceConfiguration {
  topP?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface ConversationInput {
  aiModel: AiModel;
  systemPrompt: string;
  inferenceConfiguration?: InferenceConfiguration;
  tools?: ToolDefinition[];
  handler?: DefineFunction | string;
}

export interface ConversationType
  extends Brand<typeof brandName>,
    ConversationInput {}

function _conversation(input: ConversationInput): ConversationType {
  return { ...brand(brandName), ...input };
}

export function conversation(input: ConversationInput): ConversationType {
  return _conversation(input);
}
