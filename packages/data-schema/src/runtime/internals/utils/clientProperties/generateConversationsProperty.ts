// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  ClientInternalsGetter,
  GraphQLProviderConfig,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../../bridge-types';

import { listFactory } from '../../operations/list';
import { Conversation } from '../../../../ai/ConversationType';
import { createConversationSession } from '../../ai/createConversationSession';
import { getSessionModelInstance } from '../../ai/getSessionModelInstance';

export function generateConversationsProperty(
  client: BaseClient,
  apiGraphQLConfig: GraphQLProviderConfig['GraphQL'],
  getInternals: ClientInternalsGetter,
): Record<string, Conversation> {
  const conversations: Record<string, Conversation> = {};

  const modelIntrospection: ModelIntrospectionSchema | undefined =
    apiGraphQLConfig.modelIntrospection;

  // conversations will be absent from model intro schema if no conversation routes
  // are present on the source schema.
  if (!modelIntrospection?.conversations) {
    return {};
  }

  for (const conversation of Object.values(modelIntrospection.conversations)) {
    const { models } = conversation;
    let sessionModel: SchemaModel | undefined;
    let messageModel: SchemaModel | undefined;

    for (const key in models) {
      if (key.startsWith('ConversationSession')) {
        sessionModel = models[key];
      }
      if (key.startsWith('ConversationMessage')) {
        messageModel = models[key];
      }
    }

    if (!(sessionModel && messageModel)) {
      return {};
    }

    const startSession: Conversation['startSession'] = async (input) => {
      const session = await getSessionModelInstance(
        input,
        client,
        modelIntrospection,
        sessionModel,
        getInternals,
      );

      return createConversationSession(
        session,
        client,
        modelIntrospection,
        messageModel,
        getInternals,
      );
    };

    const listSessions: Conversation['listSessions'] = async () => {
      const list = listFactory(
        client,
        modelIntrospection,
        sessionModel,
        getInternals,
      ) as () => Promise<any>;
      const { data } = await list();

      return data.map((session: any) =>
        createConversationSession(
          session,
          client,
          modelIntrospection,
          messageModel,
          getInternals,
        ),
      );
    };

    conversations[conversation.name] = {
      startSession,
      listSessions,
    };
  }

  return conversations;
}
