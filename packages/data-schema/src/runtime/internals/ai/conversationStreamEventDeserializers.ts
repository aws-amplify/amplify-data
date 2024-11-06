// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ConversationStreamEvent } from "../../../ai/ConversationType";
import { ToolUseBlock } from "../../../ai/types/contentBlocks";
import { ConversationStreamErrorEvent } from "../../../ai/types/ConversationStreamEvent";

export const convertItemToConversationStreamEventIR =  ({
  id,
  conversationId,
  associatedUserMessageId,
  contentBlockIndex,
  contentBlockDoneAtIndex,
  contentBlockDeltaIndex,
  contentBlockText,
  contentBlockToolUse,
  stopReason,
  errors,
}: any): { event?: ConversationStreamEvent, errors?: ConversationStreamErrorEvent } => {
  if (errors) {
    const errorEvent = {
      id,
      conversationId,
      associatedUserMessageId,
      errors,
    } as ConversationStreamErrorEvent;
    return { errors: errorEvent };
  }
  const event = removeNullsFromConversationStreamEvent({
    conversationId,
    associatedUserMessageId,
    contentBlockIndex,
    contentBlockDoneAtIndex,
    contentBlockDeltaIndex,
    text: contentBlockText,
    toolUse: deserializeToolUseBlock(contentBlockToolUse),
    stopReason,
    id,
  });

  return { event };
}

export const convertItemToConversationStreamEvent = ({
  id,
  conversationId,
  associatedUserMessageId,
  contentBlockIndex,
  contentBlockDoneAtIndex,
  contentBlockDeltaIndex,
  contentBlockText,
  contentBlockToolUse,
  stopReason,
}: any): ConversationStreamEvent =>
  removeNullsFromConversationStreamEvent({
    conversationId,
    associatedUserMessageId,
    contentBlockIndex,
    contentBlockDoneAtIndex,
    contentBlockDeltaIndex,
    text: contentBlockText,
    toolUse: deserializeToolUseBlock(contentBlockToolUse),
    stopReason,
    id,
  });

const deserializeToolUseBlock = (
  contentBlockToolUse: any,
): ToolUseBlock | undefined => {
  if (contentBlockToolUse) {
    const toolUseBlock = {
      ...contentBlockToolUse,
      input: JSON.parse(contentBlockToolUse.input),
    };

    return toolUseBlock;
  }
};

const removeNullsFromConversationStreamEvent = (
  block: ConversationStreamEvent,
): ConversationStreamEvent =>
  Object.fromEntries(
    Object.entries(block).filter(([_, v]) => v !== null),
  ) as ConversationStreamEvent;
