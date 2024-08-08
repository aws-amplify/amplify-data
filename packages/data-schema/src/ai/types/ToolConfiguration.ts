// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { DocumentType } from '../../runtime/bridge-types';

interface ToolJsonInputSchema {
  json: DocumentType;
}

export interface ToolSpecification {
  name: string;
  inputSchema: ToolJsonInputSchema;
  description?: string;
}

export type Tool = Omit<ToolSpecification, 'name'>;

export interface ToolConfiguration {
  tools: Record<string, Tool>;
}
