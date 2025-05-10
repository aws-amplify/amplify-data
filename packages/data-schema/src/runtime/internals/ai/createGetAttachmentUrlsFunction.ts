// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Conversation,
  ConversationAttachmentUrls,
} from '../../../ai/ConversationType';
import type { SingularReturnValue } from '../../../runtime/client';
import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
} from '../../bridge-types';
import {
  AiAction,
  getCustomUserAgentDetails,
} from './getCustomUserAgentDetails';
import { customOpFactory } from '../operations/custom';

export const createGetAttachmentUrlsFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationId: string,
    conversationRouteName: string,
    getInternals: ClientInternalsGetter,
  ): Conversation['getAttachmentUrls'] =>
  async (input) => {
    const { conversations } = modelIntrospection;

    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
      return {} as SingularReturnValue<ConversationAttachmentUrls>;
    }

    // TODO this should go to MIS generation somewhere.
    const getAttachmentUrlSchema = {
      name: 'getAttachmentUploadUrlChat',
      isArray: false,
      type: {
        nonModel: 'AmplifyAIAttachmentUrls',
      },
      isRequired: false,
      arguments: {
        input: {
          name: 'input',
          isArray: false,
          "type": {
            "input": "GetConversationMessageChatAttachmentUrlsInput"
          },
          isRequired: true,
        },
        // conversationId: {
        //   name: 'conversationId',
        //   isArray: false,
        //   type: 'ID',
        //   isRequired: true,
        // },
        // attachmentKey: {
        //   name: 'attachmentKey',
        //   isArray: false,
        //   type: 'String',
        //   isRequired: true,
        // },
      },
    };
    const getAttachmentUrlOperation = customOpFactory(
      client,
      modelIntrospection,
      'query',
      getAttachmentUrlSchema,
      false,
      getInternals,
      getCustomUserAgentDetails(AiAction.GetAttachmentUrls),
    ) as (
      args?: Record<string, any>,
    ) => SingularReturnValue<ConversationAttachmentUrls>;
    const { data, errors } = await getAttachmentUrlOperation({
      input: {
        conversationId,
        attachmentKey: input.attachmentKey,
      }
    });
    return {
      data,
      errors,
    };
  };
