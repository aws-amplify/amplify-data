// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  Conversation,
  ConversationRoute,
} from '../../../ai/ConversationType';
import type { ListReturnValue } from '../../../runtime/client';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { listFactory } from '../operations/list';
import { convertItemToConversation } from './convertItemToConversation';

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
    ) as (args?: Record<string, any>) => ListReturnValue<Conversation>;
    const { data, nextToken, errors } = await list(input);
    return {
      data: data.map((conversation: any) =>
        convertItemToConversation(
          conversation,
          client,
          modelIntrospection,
          conversationRouteName,
          conversationMessageModel,
          getInternals,
        ),
      ),
      nextToken,
      errors,
    };
  };
