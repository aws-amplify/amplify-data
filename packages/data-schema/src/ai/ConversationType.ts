// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Subscription } from 'rxjs';
import type {
  ContentBlock,
  ImageBlock,
  ImageSource,
  ToolResultContentBlock,
  ToolSpecification,
} from '@aws-sdk/client-bedrock-runtime';
import type { ListReturnValue, SingularReturnValue } from '../runtime/client';
import { type Brand, brand } from '../util';

const brandName = 'conversationCustomOperation';

export interface ConversationType extends Brand<typeof brandName> {}

// Utility type for Omitting a common property across all members of a union
type DistributiveOmit<T, K extends keyof T> = T extends any
  ? Omit<T, K>
  : never;

// Pared down Bedrock content types
interface SupportedImageBlock extends Omit<ImageBlock, 'source'> {
  source: Omit<ImageSource.BytesMember, '$unknown'>;
}

interface SupportedToolResultContentBlockImageMember
  extends Omit<ToolResultContentBlock.ImageMember, 'image'> {
  image: SupportedImageBlock;
}

type SupportedToolResultContentBlockMembers = DistributiveOmit<
  | ToolResultContentBlock.TextMember
  | ToolResultContentBlock.JsonMember
  | SupportedToolResultContentBlockImageMember,
  '$unknown' | 'document'
>;

interface SupportedToolResultContentBlock
  extends Omit<ContentBlock.ToolResultMember, 'toolResult'> {
  toolResult: SupportedToolResultContentBlockMembers;
}

interface SupportedContentBlockImageMember
  extends Omit<ContentBlock.ImageMember, 'image'> {
  image: SupportedImageBlock;
}

type ConversationMessageContent = DistributiveOmit<
  | ContentBlock.TextMember
  | ContentBlock.ToolUseMember
  | SupportedContentBlockImageMember
  | SupportedToolResultContentBlock,
  '$unknown' | 'document' | 'guardContent'
>;

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
interface ConversationSendMessageInput<T extends Tools> {
  content: DistributiveOmit<
    Exclude<ConversationMessageContent, ContentBlock.ToolUseMember>,
    'toolUse'
  >[];
  aiContext?: string | Record<string, any>;
  toolConfiguration?: ToolConfiguration<T>;
}

interface ConversationListMessagesInput {
  limit?: number;
  nextToken?: string | null;
}

type ConversationOnMessageHandler = (message: ConversationMessage) => void;

export interface Conversation {
  id: string;
  sendMessage: <T extends Tools>(
    input: ConversationSendMessageInput<T>,
  ) => SingularReturnValue<ConversationMessage>;
  listMessages: (
    input?: ConversationListMessagesInput,
  ) => ListReturnValue<ConversationMessage>;
  onMessage: (handler: ConversationOnMessageHandler) => Subscription;
}

// conversation message types
export interface ConversationMessage {
  content: ConversationMessageContent[];
  conversationId: string;
  createdAt: string;
  id: string;
  role: 'user' | 'assistant';
}

// tool types
type Tool = Omit<ToolSpecification, 'name'>;

type Tools = Record<NonNullable<ToolSpecification['name']>, Tool>;

interface ToolConfiguration<T extends Tools> {
  tools: T;
  toolUseStrategy?: ToolUseStrategy<T>;
}

type ToolUseStrategy<T extends Tools> =
  | {
      strategy: 'any';
    }
  | {
      strategy: 'specific';
      toolName: keyof T;
    };

function _conversation() {
  return {
    ...brand(brandName),
  } as ConversationType;
}

export function conversation() {
  return _conversation();
}
