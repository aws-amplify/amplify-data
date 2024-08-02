// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const convertItemToConversationMessage = ({
  content,
  createdAt,
  id,
  sessionId,
  sender,
}: any) => ({
  content: JSON.parse(content),
  conversationId: sessionId,
  createdAt,
  id,
  role: sender,
});
