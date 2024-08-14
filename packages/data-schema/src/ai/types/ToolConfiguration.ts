// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { DocumentType } from '../../runtime/bridge-types';

interface ToolJsonInputSchema {
  json: DocumentType;
}

export interface Tool {
  inputSchema: ToolJsonInputSchema;
  description?: string;
}

export interface ToolConfiguration {
  tools: Record<string, Tool>;
}
