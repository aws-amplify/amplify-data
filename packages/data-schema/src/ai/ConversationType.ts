// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Subscription } from 'rxjs';
import type { ListReturnValue, SingularReturnValue } from '../runtime/client';
import { type Brand, brand } from '../util';
import type { RefType } from '../RefType';
import { InferenceConfiguration } from './ModelType';
import {
  ConversationMessageContent,
  ConversationSendMessageInputContent,
} from './types/ConversationMessageContent';
import { ToolConfiguration } from './types/ToolConfiguration';
import { AiModel } from '@aws-amplify/data-schema-types';

export const brandName = 'conversationCustomOperation';

// conversation message types
export interface ConversationMessage {
  content: ConversationMessageContent[];
  conversationId: string;
  createdAt: string;
  id: string;
  role: 'user' | 'assistant';
}

export interface ConversationStreamEvent {
  conversationId: string;
  associatedUserMessageId: string;
  contentBlockIndex: number;
  contentBlockDoneAtIndex?: number
  contentBlockDeltaIndex?: number;
  contentBlockText?: string;
  contentBlockToolUse?: string;
  stopReason?: string;
}
// conversation route types
interface ConversationRouteGetInput {
  id: string;
}

interface ConversationRouteDeleteInput {
  id: string;
}

interface ConversationRouteCreateInput {
  metadata?: Record<string, any>;
  name?: string;
}

interface ConversationRouteUpdateInput {
  id: string;
  metadata?: Record<string, any>;
  name?: string;
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
  create: (
    input?: ConversationRouteCreateInput,
  ) => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Creates a {@link Conversation} from the current conversation route.
   */
  update: (
    input: ConversationRouteUpdateInput,
  ) => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Gets an existing {@link Conversation} based on ID.
   */
  get: (input: ConversationRouteGetInput) => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Deletes an existing {@link Conversation} based on ID.
   */
  delete: (
    input: ConversationRouteDeleteInput,
  ) => SingularReturnValue<Conversation>;
  /**
   * @experimental
   *
   * Lists all existing {@link Conversation}s on the current conversation route.
   */
  list: (input?: ConversationRouteListInput) => ListReturnValue<Conversation>;
}

// conversation types
interface ConversationSendMessageInputObject {
  content: ConversationSendMessageInputContent[];
  aiContext?: string | Record<string, any>;
  toolConfiguration?: ToolConfiguration;
}

export type ConversationSendMessageInput =
  | ConversationSendMessageInputObject
  | string;

interface ConversationListMessagesInput {
  limit?: number;
  nextToken?: string | null;
}

type ConversationOnMessageHandler = (message: ConversationMessage) => void;

type ConversationOnStreamEventHandler = (streamEvent: ConversationStreamEvent) => void;

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;

  metadata?: Record<string, any>;
  name?: string;
  /**
   * @experimental
   *
   * Sends a message to the current conversation.
   */
  sendMessage: (
    input: ConversationSendMessageInput | string,
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
  /**
   * @experimental
   *
   * Subscribes to new stream events on the current conversation.
   */
  onStreamEvent: (handler: ConversationOnStreamEventHandler) => Subscription;
}

// schema definition input
export interface ToolDefinition {
  query: RefType<any>;
  description: string;
}

// Type that is compatible with ConversationHandlerFunctionFactory
// defined in https://github.com/aws-amplify/amplify-backend/blob/main/packages/backend-ai/API.md
export type DefineConversationHandlerFunction = {
  // Explicitly enumerate major versions of event to assure
  // that customer is passing compatible version of conversation handler.
  readonly eventVersion: `1.${number}`;
  readonly provides?: string | undefined;
  getInstance: (props: any) => any;
};

export interface ConversationInput {
  aiModel: AiModel;
  systemPrompt: string;
  inferenceConfiguration?: InferenceConfiguration;
  tools?: ToolDefinition[];
  handler?: DefineConversationHandlerFunction;
}

export interface InternalConversationType
  extends ConversationType,
    ConversationInput {}

export interface ConversationType extends Brand<typeof brandName> {}

function _conversation(input: ConversationInput): ConversationType {
  return { ...brand(brandName), ...input };
}

/**
 * @experimental
 *
 * Define an AI conversation route which enables multi-turn conversation APIs for interacting with specified AI model.
 * @example
 * realtorChat: a.conversation({
 *   aiModel: { resourcePath },
 *   systemPrompt: 'You are a helpful real estate assistant',
 * })
 * @returns a conversation route definition
 */
export function conversation(input: ConversationInput): ConversationType {
  return _conversation(input);
}
