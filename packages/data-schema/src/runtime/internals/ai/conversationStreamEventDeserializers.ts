// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ConversationStreamEvent } from "../../../ai/ConversationType";
import { ToolUseBlock } from "../../../ai/types/contentBlocks";
import { ConversationStreamErrorEvent } from "../../../ai/types/ConversationStreamEvent";

export const convertItemToConversationStreamEvent =  ({
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
}: any): { next?: ConversationStreamEvent, error?: ConversationStreamErrorEvent } => {
  if (errors) {
    const error = {
      id,
      conversationId,
      associatedUserMessageId,
      errors,
    };
    return { error };
  }
  const next = removeNullsFromConversationStreamEvent({
    id,
    conversationId,
    associatedUserMessageId,
    contentBlockIndex,
    contentBlockDoneAtIndex,
    contentBlockDeltaIndex,
    text: contentBlockText,
    toolUse: deserializeToolUseBlock(contentBlockToolUse),
    stopReason,
  });

  return { next };
};

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
