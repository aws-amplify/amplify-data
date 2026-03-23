// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { deserializeContent } from './conversationMessageDeserializers';

export const convertItemToConversationMessage = (item: any) => {
  console.log('[convertItemToConversationMessage] raw item:', JSON.stringify(item, null, 2));
  const { content, createdAt, id, conversationId, role, metrics, usage } = item;
  const result = {
    content: deserializeContent(content ?? []),
    conversationId,
    createdAt,
    id,
    role,
    ...(metrics && { metrics }),
    ...(usage && { usage }),
  };
  console.log('[convertItemToConversationMessage] result:', JSON.stringify(result, null, 2));
  return result;
};
