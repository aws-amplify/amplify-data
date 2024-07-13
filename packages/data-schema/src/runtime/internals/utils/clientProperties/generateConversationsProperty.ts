// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ConversationRoute } from '../../../../ai/ConversationType';
import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
} from '../../../bridge-types';
import { createCreateConversationFunction } from '../../ai/createCreateConversationFunction';
import { createGetConversationFunction } from '../../ai/createGetConversationFunction';
import { createListConversationsFunction } from '../../ai/createListConversationsFunction';

export function generateConversationsProperty(
  client: BaseClient,
  apiGraphQLConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): Record<string, ConversationRoute> {
  const modelIntrospection: ModelIntrospectionSchema | undefined =
    apiGraphQLConfig?.modelIntrospection;

  // conversations will be absent from model intro schema if no conversation routes
  // are present on the source schema.
  if (!modelIntrospection?.conversations) {
    return {};
  }

  const conversations: Record<string, ConversationRoute> = {};

  for (const {
    name,
    conversation,
    message,
    models,
    nonModels,
    enums,
  } of Object.values(modelIntrospection.conversations)) {
    const conversationModel = models[conversation.modelName];
    const conversationMessageModel = models[message.modelName];

    if (!conversationModel || !conversationMessageModel) {
      return {};
    }

    const conversationModelIntrospection: ModelIntrospectionSchema = {
      ...modelIntrospection,
      models: {
        ...modelIntrospection.models,
        ...models,
      },
      nonModels: {
        ...modelIntrospection.nonModels,
        ...nonModels,
      },
      enums: {
        ...modelIntrospection.enums,
        ...enums,
      },
    };

    conversations[name] = {
      create: createCreateConversationFunction(
        client,
        conversationModelIntrospection,
        name,
        conversationModel,
        conversationMessageModel,
        getInternals,
      ),
      get: createGetConversationFunction(
        client,
        conversationModelIntrospection,
        name,
        conversationModel,
        conversationMessageModel,
        getInternals,
      ),
      list: createListConversationsFunction(
        client,
        conversationModelIntrospection,
        name,
        conversationModel,
        conversationMessageModel,
        getInternals,
      ),
    };
  }

  return conversations;
}
