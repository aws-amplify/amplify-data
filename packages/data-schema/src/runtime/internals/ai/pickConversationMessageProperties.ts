// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const pickConversationMessageProperties = ({
  content,
  createdAt,
  id,
  conversationId,
  role,
}: any) => ({
  content,
  conversationId,
  createdAt,
  id,
  role,
});
