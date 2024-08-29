// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Subscription } from 'rxjs';
import type { DefineFunction } from '@aws-amplify/data-schema-types';
import type { ListReturnValue, SingularReturnValue } from '../runtime/client';
import { type Brand, brand } from '../util';
import type { RefType } from '../RefType';
import { AiModel, InferenceConfiguration } from './AiModelType';
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
  /**
   * @experimental
   *
   * Creates a {@link Conversation} from the current conversation route.
   */
  create: () => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Gets an existing {@link Conversation} based on ID.
   */
  get: (input: ConversationRouteGetInput) => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Lists all existing {@link Conversation}s on the current conversation route.
   */
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
  /**
   * @experimental
   *
   * Sends a message to the current conversation.
   */
  sendMessage: (
    input: ConversationSendMessageInput,
  ) => SingularReturnValue<ConversationMessage>;
  /**
   * @experimental
   *
   * Lists all existing messages for the current conversation.
   */
  listMessages: (
    input?: ConversationListMessagesInput,
  ) => ListReturnValue<ConversationMessage>;
  /**
   * @experimental
   *
   * Subscribes to new messages on the current conversation.
   */
  onMessage: (handler: ConversationOnMessageHandler) => Subscription;
}

// schema definition input
export interface ToolDefinition {
  query: RefType<any>;
  description: string;
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

/**
 * @experimental
 *
 * Define an AI conversation route enabling multi-turn conversation APIs for interacting with specified AI model.
 * @example
 * realtorChat: a
 *   .conversation({
 *      aiModel: { friendlyName, resourcePath },
 *      systemPrompt: 'You are a helpful real estate assisstant',
 *   })
 * @returns a conversation route definition
 */
export function conversation(input: ConversationInput): ConversationType {
  return _conversation(input);
}
