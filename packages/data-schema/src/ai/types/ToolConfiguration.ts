// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { JSONSchema4 } from 'json-schema';

interface ObjectTypedJSONSchema4 extends JSONSchema4 {
  type: 'object';
}

interface ToolJsonInputSchema {
  /**
   * The schema for the tool. The top level schema type must be object.
   */
  json: ObjectTypedJSONSchema4;
}

export interface Tool {
  inputSchema: ToolJsonInputSchema;
  description?: string;
}

export interface ToolConfiguration {
  tools: Record<string, Tool>;
}
