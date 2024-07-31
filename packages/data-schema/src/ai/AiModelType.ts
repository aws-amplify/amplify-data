// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const brandName = 'aiModel';

export interface AiModel {
  friendlyName: string;
  resourcePath: string;
}

export function claude3Haiku(): AiModel {
  return {
    friendlyName: 'Claude3Haiku',
    resourcePath: 'anthropic.claude-3-haiku-20240307-v1:0',
  };
}

export function claude3Sonnet(): AiModel {
  return {
    friendlyName: 'Claude3Sonnet',
    resourcePath: 'anthropic.claude-3-sonnet-20240229-v1:0',
  };
}

export const aiModel = {
  anthropic: {
    claude3Haiku,
    claude3Sonnet,
  },
};
