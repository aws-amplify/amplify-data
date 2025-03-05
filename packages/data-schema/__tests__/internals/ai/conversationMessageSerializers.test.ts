// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { toBase64 } from '@smithy/util-base64';
import type {
  ConversationMessageImageContent,
  ConversationMessageDocumentContent,
} from '../../../src/ai/types/ConversationMessageContent';
import type { ToolResultImageContent } from '../../../src/ai/types/ToolResultContent';
import {
  serializeAiContext,
  serializeContent,
  serializeToolConfiguration,
} from '../../../src/runtime/internals/ai/conversationMessageSerializers';

jest.mock('@smithy/util-base64');

describe('conversationMessageSerializers', () => {
  const mockBase64String = 'Zm9v'; // foo
  const mockAiContext = { arbitrary: 'context' };
  const mockJson = { foo: 'bar' };
  const mockImageSourceBytes = new Uint8Array([102, 111, 111]);
  const mockTextContent = { text: 'foo' };
  const mockImageContent = {
    image: {
      format: 'png',
      source: { bytes: mockImageSourceBytes },
    },
  };
  const mockDocumentContent = {
    document: {
      format: 'pdf',
      name: 'sample-doc',
      source: { bytes: mockImageSourceBytes },
    },
  };
  const mockJsonContent = { json: mockJson };
  const mockToolResultContent = {
    toolResult: {
      content: [
        mockTextContent,
        mockImageContent as ToolResultImageContent,
        mockJsonContent,
      ],
      toolUseId: 'tool-use-id',
    },
  };
  const mockTimeToolName = 'currentTime';
  const mockTimeTool = {
    description: 'Get current time',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          timeZone: {
            type: 'string',
          },
        },
      },
    },
  } as const;
  const mockWeatherToolName = 'currentWeather';
  const mockWeatherTool = {
    description: 'Get current weather',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
          },
        },
      },
    },
  } as const;
  const mockToolConfiguration = {
    tools: {
      [mockTimeToolName]: mockTimeTool,
      [mockWeatherToolName]: mockWeatherTool,
    },
  };
  // assert mocks
  const mockToBase64 = toBase64 as jest.Mock;

  beforeAll(() => {
    mockToBase64.mockReturnValue(mockBase64String);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('serializeAiContext()', () => {
    it('serializes aiContent', () => {
      expect(serializeAiContext(mockAiContext)).toStrictEqual(
        JSON.stringify(mockAiContext),
      );
    });
  });

  describe('serializeContent()', () => {
    it('serializes image content', () => {
      const mockConversationMessageContent = [
        mockImageContent as ConversationMessageImageContent,
      ];
      expect(serializeContent(mockConversationMessageContent)).toStrictEqual([
        {
          image: {
            ...mockImageContent.image,
            source: {
              bytes: mockBase64String,
            },
          },
        },
      ]);
      expect(mockToBase64).toHaveBeenCalledWith(mockImageSourceBytes);
    });

    it('serializes document content', () => {
      const mockConversationMessageContent = [
        mockDocumentContent as ConversationMessageDocumentContent,
      ];
      expect(serializeContent(mockConversationMessageContent)).toStrictEqual([
        {
          document: {
            ...mockDocumentContent.document,
            source: {
              bytes: mockBase64String,
            },
          },
        },
      ]);
      expect(mockToBase64).toHaveBeenCalledWith(mockImageSourceBytes);
    });

    it('serializes toolResult content', () => {
      const mockConversationMessageContent = [mockToolResultContent];
      expect(serializeContent(mockConversationMessageContent)).toStrictEqual([
        {
          toolResult: {
            ...mockToolResultContent.toolResult,
            content: [
              mockTextContent,
              {
                image: {
                  ...mockImageContent.image,
                  source: {
                    bytes: mockBase64String,
                  },
                },
              },
              { json: JSON.stringify(mockJson) },
            ],
          },
        },
      ]);
    });
  });

  describe('serializeToolConfiguration()', () => {
    it('serializes toolConfiguration', () => {
      expect(serializeToolConfiguration(mockToolConfiguration)).toStrictEqual({
        tools: [
          {
            toolSpec: {
              name: mockTimeToolName,
              description: mockTimeTool.description,
              inputSchema: {
                json: JSON.stringify(mockTimeTool.inputSchema.json),
              },
            },
          },
          {
            toolSpec: {
              name: mockWeatherToolName,
              description: mockWeatherTool.description,
              inputSchema: {
                json: JSON.stringify(mockWeatherTool.inputSchema.json),
              },
            },
          },
        ],
      });
    });
  });
});
