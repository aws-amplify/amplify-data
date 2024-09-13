// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CustomUserAgentDetails } from '../../bridge-types';

export type AiCategory = 'ai';

export enum AiAction {
  CreateConversation = '1',
  GetConversation = '2',
  ListConversations = '3',
  SendMessage = '4',
  ListMessages = '5',
  OnMessage = '6',
  Generation = '7',
}

export const getCustomUserAgentDetails = (
  action: AiAction,
): CustomUserAgentDetails => ({
  category: 'ai',
  action,
});
