// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { toBase64 } from '@smithy/util-base64';
import type {
  ConversationMessageContent,
  ConversationMessageImageContent,
  ConversationMessageDocumentContent,
  ConversationMessageToolResultContent,
} from '../../../ai/types/ConversationMessageContent';
import type { ToolConfiguration } from '../../../ai/types/ToolConfiguration';
import type { ToolResultJsonContent } from '../../../ai/types/ToolResultContent';

export const serializeAiContext = (aiContext: string | Record<string, any>) =>
  JSON.stringify(aiContext);

export const serializeContent = (content: ConversationMessageContent[]) =>
  content.map((block) => {
    if (block.image) {
      return serializeImageBlock(block);
    }
    if (block.document) {
      return serializeDocumentBlock(block);
    }
    if (block.toolResult) {
      return serializeToolResultBlock(block);
    }
    return block;
  });

export const serializeToolConfiguration = ({ tools }: ToolConfiguration) => ({
  tools: Object.entries(tools).map(([name, tool]) => ({
    toolSpec: {
      name,
      description: tool.description,
      inputSchema: {
        json: JSON.stringify(tool.inputSchema.json),
      },
    },
  })),
});

const serializeImageBlock = ({ image }: ConversationMessageImageContent) => ({
  image: {
    ...image,
    source: {
      ...image.source,
      bytes: toBase64(image.source.bytes),
    },
  },
});

const serializeDocumentBlock = ({
  document,
}: ConversationMessageDocumentContent) => ({
  document: {
    ...document,
    source: {
      ...document.source,
      bytes: toBase64(document.source.bytes),
    },
  },
});

const serializeJsonBlock = ({ json }: ToolResultJsonContent) => ({
  json: JSON.stringify(json),
});

const serializeToolResultBlock = ({
  toolResult,
}: ConversationMessageToolResultContent) => ({
  toolResult: {
    ...toolResult,
    content: toolResult.content.map((toolResultBlock) => {
      if (toolResultBlock.image) {
        return serializeImageBlock(toolResultBlock);
      }
      if (toolResultBlock.json) {
        return serializeJsonBlock(toolResultBlock);
      }
      return toolResultBlock;
    }),
  },
});
