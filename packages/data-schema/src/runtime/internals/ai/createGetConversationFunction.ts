// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  Conversation,
  ConversationRoute,
} from '../../../ai/ConversationType';
import type { SingularReturnValue } from '../../../runtime/client';
import type {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { getFactory } from '../operations/get';
import { convertItemToConversation } from './convertItemToConversation';

export const createGetConversationFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    conversationModel: SchemaModel,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationRoute['get'] =>
  async ({ id }) => {
    const get = getFactory(
      client,
      modelIntrospection,
      conversationModel,
      'READ',
      getInternals,
    ) as (args?: Record<string, any>) => SingularReturnValue<Conversation>;
    const { data, errors } = await get({ id });
    return {
      data: data
        ? convertItemToConversation(
            data,
            client,
            modelIntrospection,
            conversationRouteName,
            conversationMessageModel,
            getInternals,
          )
        : data,
      errors,
    };
  };
