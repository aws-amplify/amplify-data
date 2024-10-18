// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ConversationStreamEvent } from "../../../ai/ConversationType";
import { ToolUseBlock } from "../../../ai/types/contentBlocks";

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
}: any): ConversationStreamEvent => ({
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
