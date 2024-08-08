// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { deserializeContent } from './conversationMessageDeserializers';

export const convertItemToConversationMessage = ({
  content,
  createdAt,
  id,
  conversationId,
  role,
}: any) => ({
  content: deserializeContent(content),
  conversationId,
  createdAt,
  id,
  role,
});
