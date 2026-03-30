// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { deserializeContent } from './conversationMessageDeserializers';

export const convertItemToConversationMessage = (item: any) => {
  const { content, createdAt, id, conversationId, role, metrics, usage } = item;
  return {
    content: deserializeContent(content ?? []),
    conversationId,
    createdAt,
    id,
    role,
    ...(metrics != null && { metrics }),
    ...(usage != null && { usage }),
  };
};
