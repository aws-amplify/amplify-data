// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { DocumentType } from '../../runtime/bridge-types';
import { ImageBlock } from './contentBlocks';

interface ToolResultTextContent {
  text: string;
  image?: never;
  json?: never;
}

interface ToolResultImageContent {
  text?: never;
  image: ImageBlock;
  json?: never;
}

interface ToolResultJsonContent {
  text?: never;
  image?: never;
  json: DocumentType;
}

export type ToolResultContent =
  | ToolResultTextContent
  | ToolResultImageContent
  | ToolResultJsonContent;
