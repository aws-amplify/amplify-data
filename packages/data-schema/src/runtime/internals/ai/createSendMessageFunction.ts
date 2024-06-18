// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { getFactory } from '../operations/get';
import type { ConversationSession } from '../../../ai/ConversationType';

export const createSendMessageFunction =
  (
    session: any,
    client: BaseClient,
    modelIntrospection: ModelIntrospectionSchema,
    messageModel: SchemaModel,
    getInternals: ClientInternalsGetter,
  ): ConversationSession['sendMessage'] =>
  ({ content }): Promise<void> => {
    return (
      getFactory(
        client,
        modelIntrospection,
        messageModel,
        'CREATE',
        getInternals,
      ) as (args: any) => Promise<any>
    )({
      content: JSON.stringify(content),
      role: 'user',
      sessionId: session.id,
    });
  };
