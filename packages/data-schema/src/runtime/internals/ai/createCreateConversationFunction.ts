// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../ai/ConversationType';
import type { SingularReturnValue } from '../../../runtime/client';
import {
  AiAction,
  BaseClient,
  Category,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { getFactory } from '../operations/get';
import { convertItemToConversation } from './convertItemToConversation';

export const createCreateConversationFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    conversationModel: SchemaModel,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationRoute['create'] =>
  async () => {
    const get = getFactory(
      client,
      modelIntrospection,
      conversationModel,
      'CREATE',
      getInternals,
      false,
      {
        category: Category.AI,
        action: AiAction.CreateConversation,
      },
    ) as () => SingularReturnValue<Record<string, any>>;
    const { data, errors } = await get();
    return {
      data: convertItemToConversation(
        client,
        modelIntrospection,
        data?.id,
        conversationRouteName,
        conversationMessageModel,
        getInternals,
      ),
      errors,
    };
  };
