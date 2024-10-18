// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ConversationStreamEvent } from "../../../ai/ConversationType";

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
  contentBlockText,
  contentBlockToolUse: deserializeToolUseBlock(contentBlockToolUse),
  stopReason,
  id,
});

const deserializeToolUseBlock = ({ toolUse }: Record<'toolUse', any>) =>
  toolUse
    ? {
        ...toolUse,
        input: JSON.parse(toolUse.input),
      }
    : null;
