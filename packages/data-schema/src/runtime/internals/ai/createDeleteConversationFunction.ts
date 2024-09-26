// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { ConversationRoute } from '../../../ai/ConversationType';
import type { SingularReturnValue } from '../../../runtime/client';
import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { getFactory } from '../operations/get';
import { convertItemToConversation } from './convertItemToConversation';
import { AiAction, getCustomUserAgentDetails } from './getCustomUserAgentDetails';

export const createDeleteConversationFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    conversationModel: SchemaModel,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationRoute['delete'] =>
  async ({ id }) => {
    const deleteOperation = getFactory(
      client,
      modelIntrospection,
      conversationModel,
      'DELETE',
      getInternals,
      false,
      getCustomUserAgentDetails(AiAction.Delete),
    ) as (
      args?: Record<string, any>,
    ) => SingularReturnValue<Record<string, any>>;
    const { data, errors } = await deleteOperation({ id });
    return {
      data: data
        ? convertItemToConversation(
            client,
            modelIntrospection,
            data?.id,
            data?.createdAt,
            data?.updatedAt,
            conversationRouteName,
            conversationMessageModel,
            getInternals,
            data?.metadata,
            data?.name,
          )
        : data,
      errors,
    };
  };
