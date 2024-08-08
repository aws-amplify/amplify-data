// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SingularReturnValue } from '../..';
import type {
  Conversation,
  ConversationMessage,
} from '../../../ai/ConversationType';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import { customOpFactory } from '../operations/custom';
import { pickConversationMessageProperties } from './pickConversationMessageProperties';
import { Tool, ToolSpecification } from '../../../ai/types/ToolConfiguration';

export const createSendMessageFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationId: string,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['sendMessage'] =>
  async ({ aiContext, content, toolConfiguration }) => {
    const { conversations } = modelIntrospection;

    const tools: { toolSpec: ToolSpecification }[] = toolConfiguration?.tools
      ? Object.entries(toolConfiguration.tools).map(convertToolForGql)
      : [];
    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
      return {} as SingularReturnValue<ConversationMessage>;
    }
    const sendSchema = conversations[conversationRouteName].message.send;
    const sendOperation = customOpFactory(
      client,
      modelIntrospection,
      'mutation',
      sendSchema,
      false,
      getInternals,
    ) as (
      args?: Record<string, any>,
    ) => SingularReturnValue<ConversationMessage>;
    const { data, errors } = await sendOperation({
      aiContext: JSON.stringify(aiContext),
      content,
      conversationId,
      toolConfiguration: { tools },
    });
    return {
      data: data ? pickConversationMessageProperties(data) : data,
      errors,
    };
  };

  function convertToolForGql(value: [string, Tool]) {
    const [name, tool] = value;
    return {
      toolSpec: {
        name,
        description: tool.description,
        inputSchema: {
          json: JSON.stringify(tool.inputSchema?.json)
        }
      }
    };
  }