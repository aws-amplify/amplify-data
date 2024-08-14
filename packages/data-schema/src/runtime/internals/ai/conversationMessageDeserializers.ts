// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fromBase64 } from '@smithy/util-base64';
import type { ConversationMessageContent } from '../../../ai/types/ConversationMessageContent';

export const deserializeContent = (
  content: Record<string, any>[],
): ConversationMessageContent[] =>
  content.map((block) => {
    if (block.image) {
      return deserializeImageBlock(block);
    }
    if (block.toolUse) {
      return deserializeToolUseBlock(block);
    }
    if (block.toolResult) {
      return deserializeToolResultBlock(block);
    }
    return removeNullsFromBlock(block) as ConversationMessageContent;
  });

const deserializeImageBlock = ({ image }: Record<'image', any>) => ({
  image: {
    ...image,
    source: {
      ...image.source,
      bytes: fromBase64(image.source.bytes),
    },
  },
});

const deserializeJsonBlock = ({ json }: Record<'json', any>) => ({
  json: JSON.parse(json),
});

const deserializeToolUseBlock = ({ toolUse }: Record<'toolUse', any>) => ({
  toolUse: {
    ...toolUse,
    input: JSON.parse(toolUse.input),
  },
});

const deserializeToolResultBlock = ({
  toolResult,
}: Record<'toolResult', any>) => ({
  toolResult: {
    toolUseId: toolResult.toolUseId,
    content: toolResult.content.map((toolResultBlock: Record<string, any>) => {
      if (toolResultBlock.image) {
        return deserializeImageBlock(toolResultBlock);
      }
      if (toolResultBlock.json) {
        return deserializeJsonBlock(toolResultBlock);
      }
      return removeNullsFromBlock(toolResultBlock);
    }),
  },
});

const removeNullsFromBlock = (block: Record<string, any>) =>
  Object.fromEntries(Object.entries(block).filter(([_, v]) => v !== null));
