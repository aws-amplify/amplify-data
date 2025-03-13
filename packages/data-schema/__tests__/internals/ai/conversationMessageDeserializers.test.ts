// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fromBase64 } from '@smithy/util-base64';
import { deserializeContent } from '../../../src/runtime/internals/ai/conversationMessageDeserializers';

jest.mock('@smithy/util-base64');

describe('conversationMessageDeserializers', () => {
  const mockBase64String = 'Zm9v'; // foo
  const mockJson = { foo: 'bar' };
  const mockSourceBytes = new Uint8Array([102, 111, 111]);
  const mockInput = { baz: 'qux' };
  const mockTextContent = { text: 'foo' };
  const mockImageContent = {
    image: {
      format: 'png',
      source: { bytes: mockBase64String },
    },
  };
  const mockDocumentContent = {
    document: {
      format: 'pdf',
      name: 'sample-doc',
      source: { bytes: mockBase64String },
    },
  };
  const mockJsonContent = { json: JSON.stringify(mockJson) };
  const mockToolUseContent = {
    toolUse: {
      toolUseId: 'tool-use-id',
      name: 'tool-name',
      input: JSON.stringify(mockInput),
    },
  };
  const mockToolResultContent = {
    toolResult: {
      content: [mockTextContent, mockImageContent, mockJsonContent],
      toolUseId: 'tool-use-id',
    },
  };
  // assert mocks
  const mockFromBase64 = fromBase64 as jest.Mock;

  beforeAll(() => {
    mockFromBase64.mockReturnValue(mockSourceBytes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deserializeContent()', () => {
    it('deserializes image content', () => {
      const mockMessageContent = [mockImageContent];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        {
          image: {
            ...mockImageContent.image,
            source: {
              bytes: mockSourceBytes,
            },
          },
        },
      ]);
    });

    it('deserializes document content', () => {
      const mockMessageContent = [mockDocumentContent];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        {
          document: {
            ...mockDocumentContent.document,
            source: {
              bytes: mockSourceBytes,
            },
          },
        },
      ]);
    });

    it('deserializes toolUse content', () => {
      const mockMessageContent = [mockToolUseContent];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        {
          toolUse: {
            ...mockToolUseContent.toolUse,
            input: mockInput,
          },
        },
      ]);
    });

    it('deserializes toolResult content', () => {
      const mockMessageContent = [mockToolResultContent];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        {
          toolResult: {
            ...mockToolResultContent.toolResult,
            content: [
              mockTextContent,
              {
                image: {
                  ...mockImageContent.image,
                  source: { bytes: mockSourceBytes },
                },
              },
              { json: mockJson },
            ],
          },
        },
      ]);
    });

    it('removes null content blocks', () => {
      const mockMessageContent = [
        {
          ...mockTextContent,
          image: null,
          toolResult: null,
        },
      ];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        mockTextContent,
      ]);
    });

    it('removes null toolResult content blocks', () => {
      const mockToolResultContentWithNulls = {
        toolResult: {
          ...mockToolResultContent.toolResult,
          content: [
            {
              ...mockTextContent,
              image: null,
              json: null,
            },
          ],
        },
      };
      const mockMessageContent = [mockToolResultContentWithNulls];
      expect(deserializeContent(mockMessageContent)).toStrictEqual([
        {
          toolResult: {
            ...mockToolResultContent.toolResult,
            content: [mockTextContent],
          },
        },
      ]);
    });
  });
});
