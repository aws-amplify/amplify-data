// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../ai/ConversationType';
import type { ListReturnValue } from '../../../runtime/client';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { listFactory } from '../operations/list';
import { convertItemToConversation } from './convertItemToConversation';
import {
  AiAction,
  getCustomUserAgentDetails,
} from './getCustomUserAgentDetails';

export const createListConversationsFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    conversationModel: SchemaModel,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationRoute['list'] =>
  async (input) => {
    const list = listFactory(
      client,
      modelIntrospection,
      conversationModel,
      getInternals,
      false,
      getCustomUserAgentDetails(AiAction.ListConversations),
    ) as (args?: Record<string, any>) => ListReturnValue<Record<string, any>>;
    const { data, nextToken, errors } = await list(input);
    return {
      data: data.map((datum: Record<string, any>) => {
        return convertItemToConversation(
          client,
          modelIntrospection,
          datum.id,
          conversationRouteName,
          conversationMessageModel,
          getInternals,
        );
      }),
      nextToken,
      errors,
    };
  };
