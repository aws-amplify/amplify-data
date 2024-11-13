// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AiModel } from '@aws-amplify/data-schema-types';
import type { Subscription } from 'rxjs';
import { allowForConversations, AllowModifierForConversations, Authorization } from '../Authorization';
import type { RefType } from '../RefType';
import type { ListReturnValue, SingularReturnValue } from '../runtime/client';
import { type Brand, brand } from '../util';
import { InferenceConfiguration } from './ModelType';
import {
  ConversationMessageContent,
  ConversationSendMessageInputContent,
} from './types/ConversationMessageContent';
import { ToolConfiguration } from './types/ToolConfiguration';
import { ConversationStreamErrorEvent, ConversationStreamEvent } from './types/ConversationStreamEvent';

export const brandName = 'conversationCustomOperation';

// conversation message types
export interface ConversationMessage {
  content: ConversationMessageContent[];
  conversationId: string;
  createdAt: string;
  id: string;
  role: 'user' | 'assistant';
  associatedUserMessageId?: string;
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

type ConversationOnStreamEventHandler = {
  next: (event: ConversationStreamEvent) => void;
  error: (error: ConversationStreamErrorEvent) => void;
};

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
   * Subscribes to new stream events on the current conversation.
   */
  onStreamEvent: (handler: ConversationOnStreamEventHandler) => Subscription;
}

// schema definition input
interface ToolDefinitionBase {
  name: string;
  description: string;
}

interface ModelToolDefinition extends ToolDefinitionBase {
  model: RefType<any>;
  modelOperation: 'list';
  query?: never;
}

interface QueryToolDefinition extends ToolDefinitionBase {
  query: RefType<any>;
  model?: never;
  modelOperation?: never;
}

export type DataToolDefinition = ModelToolDefinition | QueryToolDefinition;

/**
 * @experimental
 *
 * Define a data tool to be used within an AI conversation route.
 *
 * @remarks
 *
 * Data tools can use a model generated list query or a custom query.
 * The tool's name must satisfy the following requirements:
 * - Be unique across all tools for a given conversation.
 * - Length must be between 1 and 64 characters.
 * - Must start with a letter.
 * - Must contain only letters, numbers, and underscores.
 *
 * The tool's `name` and `description` are used by the LLM to help it understand
 * the tool's purpose.
 *
 * @example
 *
 * realtorChat: a.conversation({
 *   aiModel: a.ai.model('Claude 3 Haiku'),
 *   systemPrompt: 'You are a helpful real estate assistant',
 *   tools: [
 *     // Data tools can use a model generated list query.
 *     a.ai.dataTool({
 *       name: 'get_listed_properties',
 *       description: 'Get properties currently listed for sale',
 *       model: a.model('RealEstateProperty'),
 *       modelOperation: 'list',
 *     }),
 *     // Data tools can also use a custom query.
 *     a.ai.dataTool({
 *       name: 'get_oncall_realtor',
 *       description: 'Get the oncall realtor',
 *       query: a.query('getOnCallRealtor'),
 *     }),
 *   ],
 * })
 * @returns a data tool definition
 */
export function dataTool(input: DataToolDefinition): DataToolDefinition {
  return input;
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
  tools?: DataToolDefinition[];
  handler?: DefineConversationHandlerFunction;
}

export type InternalConversationType = ConversationType
  & ConversationInput
  & { data: ConversationData }
  & Brand<typeof brandName>;

type ConversationData = {
  authorization: Authorization<any, any, any>[];
}

export interface ConversationType extends Brand<typeof brandName> {
  authorization(
    callback: (allow: AllowModifierForConversations) => Authorization<any, any, any>,
  ): ConversationType;
}

function _conversation(input: ConversationInput): ConversationType {
  const data: ConversationData = {
    authorization: [],
  };
  const builder = {
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (allow: AllowModifierForConversations) => AuthRuleType | AuthRuleType[],
    ) {
      const rules = callback(allowForConversations);
      data.authorization = Array.isArray(rules) ? rules : [rules];

      return this;
    },
  };
  return {
    ...brand(brandName),
    ...input,
    ...builder,
    data,
  } as InternalConversationType;
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
export { ConversationStreamEvent };

