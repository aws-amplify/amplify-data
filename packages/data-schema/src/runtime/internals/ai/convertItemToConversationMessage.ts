// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const convertItemToConversationMessage = ({
  content,
  conversationId,
  createdAt,
  id,
  sender,
}: any) => ({
  content: JSON.parse(content),
  conversationId,
  createdAt,
  id,
  role: sender,
});
