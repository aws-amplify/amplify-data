// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createConversationField } from '../../src/ai/ConversationSchemaProcessor';
import type { InternalConversationType } from '../../src/ai/ConversationType';

// Mock the accessData function
jest.mock('../../src/Authorization', () => ({
  accessData: jest.fn(() => ({ strategy: 'owner', provider: 'userPools' })),
}));

describe('ConversationSchemaProcessor', () => {
  const baseMockTypeDef: InternalConversationType = {
    aiModel: {
      resourcePath: 'test-model',
    },
    systemPrompt: 'Test system prompt',
    handler: undefined,
    tools: undefined,
    data: {
      authorization: [
        {
          strategy: 'owner',
          provider: 'userPools',
        } as any,
      ],
    },
  } as any;

  describe('createConversationField', () => {
    it('should include sourceRegion when provided', () => {
      const mockTypeDef = {
        ...baseMockTypeDef,
        aiModel: {
          ...baseMockTypeDef.aiModel,
          sourceRegion: 'us-west-2',
        },
      };

      const result = createConversationField(mockTypeDef, 'testChat');
      
      expect(result.field).toContain('sourceRegion: "us-west-2"');
    });

    it('should include crossRegionInference when defined as true', () => {
      const mockTypeDef = {
        ...baseMockTypeDef,
        aiModel: {
          ...baseMockTypeDef.aiModel,
          crossRegionInference: true,
        },
      };

      const result = createConversationField(mockTypeDef, 'testChat');
      
      expect(result.field).toContain('crossRegionInference: "true"');
    });

    it('should include crossRegionInference when defined as false', () => {
      const mockTypeDef = {
        ...baseMockTypeDef,
        aiModel: {
          ...baseMockTypeDef.aiModel,
          crossRegionInference: false,
        },
      };

      const result = createConversationField(mockTypeDef, 'testChat');

      expect(result.field).toContain('crossRegionInference: "false"');
    });
  });
});
