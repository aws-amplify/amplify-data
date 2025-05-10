// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CustomUserAgentDetails } from '../../bridge-types';

/**
 * Symbol used for internal user agent overrides.
 *
 * @internal
 * This symbol is intended for internal use within the Amplify library.
 * It may change or be removed in future versions without notice.
 * External usage of this symbol is discouraged and may lead to unexpected behavior.
 */
export const INTERNAL_USER_AGENT_OVERRIDE = Symbol(
  'INTERNAL_USER_AGENT_OVERRIDE',
);

export type AiCategory = 'ai';

export enum AiAction {
  CreateConversation = '1',
  GetConversation = '2',
  ListConversations = '3',
  DeleteConversation = '4',
  SendMessage = '5',
  ListMessages = '6',
  OnStreamEvent = '7',
  Generation = '8',
  UpdateConversation = '9',
  GetAttachmentUrls = '10',
}

export const getCustomUserAgentDetails = (
  action: AiAction,
): CustomUserAgentDetails => ({
  category: 'ai',
  action,
});

/**
 * Creates a user agent override object based on custom details.
 *
 * @internal
 * This function is intended for internal use within the Amplify library.
 * It may change or be removed in future versions without notice.
 *
 * @param customUserAgentDetails - Optional custom user agent details
 * @returns An object with INTERNAL_USER_AGENT_OVERRIDE symbol as key and customUserAgentDetails as value, or undefined if no details provided
 */
export function createUserAgentOverride(
  customUserAgentDetails?: CustomUserAgentDetails,
): { [INTERNAL_USER_AGENT_OVERRIDE]?: CustomUserAgentDetails } | undefined {
  return customUserAgentDetails
    ? { [INTERNAL_USER_AGENT_OVERRIDE]: customUserAgentDetails }
    : undefined;
}
