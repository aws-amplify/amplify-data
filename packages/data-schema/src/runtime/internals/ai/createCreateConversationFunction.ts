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
import {
  AiAction,
  getCustomUserAgentDetails,
} from './getCustomUserAgentDetails';

export const createCreateConversationFunction =
  (
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    conversationRouteName: string,
    conversationModel: SchemaModel,
    conversationMessageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationRoute['create'] =>
  async (input) => {
    const { name, metadata: metadataObject } = input ?? {};
    const metadata = JSON.stringify(metadataObject);
    const createOperation = getFactory(
      client,
      modelIntrospection,
      conversationModel,
      'CREATE',
      getInternals,
      false,
      getCustomUserAgentDetails(AiAction.CreateConversation),
    ) as (args?: Record<string, any>) => SingularReturnValue<Record<string, any>>;
    const { data, errors } = await createOperation({ name, metadata });
    return {
      data: convertItemToConversation(
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
      ),
      errors,
    };
  };
