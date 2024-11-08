import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  subOptionsAndHeaders,
  pause,
} from '../../utils';

describe('AI Conversation Routes', () => {
  // data/resource.ts
  const schema = a.schema({
    chatBot: a.conversation({
      aiModel: a.ai.model('Claude 3 Haiku'),
      systemPrompt: 'You are a helpful chatbot.',
    }),
  });
  type Schema = ClientSchema<typeof schema>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Conversations', () => {
    test('Create a conversation', async () => {
      // #region mocking
      const sampleConversation = {
        id: 'conversation-id',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-08-02T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            createConversation: sampleConversation,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // create conversation
      const { data: createdConversation, errors: createConversationErrors } =
        await client.conversations.chatBot.create({
          name: 'Test Conversation',
          metadata: { arbitrary: 'data' },
        });
      // #endregion api call

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(createConversationErrors).toBeUndefined();
      expect(createdConversation).toStrictEqual({
        createdAt: '2023-06-01T12:00:00Z',
        id: sampleConversation.id,
        listMessages: expect.any(Function),
        metadata: {},
        name: 'Test Conversation',
        onStreamEvent: expect.any(Function),
        sendMessage: expect.any(Function),
        updatedAt: '2023-08-02T12:00:00Z',
      });
      // #endregion assertions
    });

    test('Update a conversation', async () => {
      const sampleConversation = {
        id: 'conversation-id',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-08-02T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            updateConversation: sampleConversation,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // create conversation
      const { data: updatedConversation, errors: updateConversationErrors } =
        await client.conversations.chatBot.update({
          id: sampleConversation.id,
          name: 'updated conversation name',
          metadata: { arbitrary: 'data' },
        });
      // #endregion api call

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(updateConversationErrors).toBeUndefined();
      expect(updatedConversation).toStrictEqual({
        createdAt: '2023-06-01T12:00:00Z',
        id: sampleConversation.id,
        listMessages: expect.any(Function),
        metadata: {},
        name: 'Test Conversation',
        onStreamEvent: expect.any(Function),
        sendMessage: expect.any(Function),
        updatedAt: '2023-08-02T12:00:00Z',
      });
      // #endregion assertions
    });

    test('Update a conversation', async () => {
      const sampleConversation = {
        id: 'conversation-id',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-08-02T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            updateConversation: sampleConversation,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // create conversation
      const { data: updatedConversation, errors: updateConversationErrors } =
        await client.conversations.chatBot.update({
          id: sampleConversation.id,
          name: 'updated conversation name',
          metadata: { arbitrary: 'data' },
        });
      // #endregion api call

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(updateConversationErrors).toBeUndefined();
      expect(updatedConversation).toStrictEqual({
        createdAt: '2023-06-01T12:00:00Z',
        id: sampleConversation.id,
        listMessages: expect.any(Function),
        metadata: {},
        name: 'Test Conversation',
        onStreamEvent: expect.any(Function),
        sendMessage: expect.any(Function),
        updatedAt: '2023-08-02T12:00:00Z',
      });
      // #endregion assertions
    });

    test('Get a conversation', async () => {
      // #region mocking
      const sampleConversation = {
        id: 'conversation-id',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-06-01T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getConversation: sampleConversation,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // get conversation
      const { data: conversation, errors: getConversationErrors } =
        await client.conversations.chatBot.get({ id: sampleConversation.id });
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(getConversationErrors).toBeUndefined();
      expect(conversation).toStrictEqual({
        createdAt: '2023-06-01T12:00:00Z',
        id: sampleConversation.id,
        listMessages: expect.any(Function),
        metadata: {},
        name: 'Test Conversation',
        onStreamEvent: expect.any(Function),
        sendMessage: expect.any(Function),
        updatedAt: '2023-06-01T12:00:00Z',
      });
      // #endregion assertions
    });

    test('List conversations', async () => {
      // #region mocking
      const sampleConversation1 = {
        id: 'conversation-id-1',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-08-02T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };
      const sampleConversation2 = {
        id: 'conversation-id-2',
        createdAt: '2024-09-02T12:00:00Z',
        updatedAt: '2024-09-05T12:00:00Z',
        metadata: {},
        name: 'Test Conversation2',
      };
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listConversations: {
              items: [sampleConversation1, sampleConversation2],
            },
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // list conversations
      const { data: conversations, errors: listConversationsErrors } =
        await client.conversations.chatBot.list();
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(listConversationsErrors).toBeUndefined();
      expect(conversations).toStrictEqual([
        {
          createdAt: '2023-06-01T12:00:00Z',
          id: sampleConversation1.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation',
          onStreamEvent: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2023-08-02T12:00:00Z',
        },
        {
          createdAt: '2024-09-02T12:00:00Z',
          id: sampleConversation2.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation2',
          onStreamEvent: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2024-09-05T12:00:00Z',
        },
      ]);
      // #endregion assertions
    });

    test('Paginate conversations', async () => {
      // #region mocking
      const sampleConversation1 = {
        id: 'conversation-id-1',
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-08-02T12:00:00Z',
        metadata: {},
        name: 'Test Conversation',
      };
      const sampleConversation2 = {
        id: 'conversation-id-2',
        createdAt: '2024-09-02T12:00:00Z',
        updatedAt: '2024-09-05T12:00:00Z',
        metadata: {},
        name: 'Test Conversation2',
      };
      const sampleNextToken = 'next-token';
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listConversations: {
              items: [sampleConversation1, sampleConversation2],
              nextToken: sampleNextToken,
            },
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const {
        data: conversations,
        nextToken,
        errors: listConversationsErrors,
      } = await client.conversations.chatBot.list({
        limit: 100,
        nextToken: 'previous-next-token',
      });
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(listConversationsErrors).toBeUndefined();
      expect(conversations).toStrictEqual([
        {
          createdAt: '2023-06-01T12:00:00Z',
          id: sampleConversation1.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation',
          onStreamEvent: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2023-08-02T12:00:00Z',
        },
        {
          createdAt: '2024-09-02T12:00:00Z',
          id: sampleConversation2.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation2',
          onStreamEvent: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2024-09-05T12:00:00Z',
        },
      ]);
      expect(nextToken).toBe(sampleNextToken);
      // #endregion assertions
    });
  });

  describe('Messages', () => {
    // #region mocking common
    const sampleConversation = {
      id: 'conversation-id',
    };
    const sampleConversationMessage1 = {
      content: [{ text: 'foo' }],
      conversationId: sampleConversation.id,
      createdAt: '2024-08-22T18:28:00.596Z',
      id: 'message-id',
      role: 'user',
    };
    const sampleConversationMessage2 = {
      content: [{ text: 'foo' }],
      conversationId: sampleConversation.id,
      createdAt: '2024-08-22T18:28:00.596Z',
      id: 'message-id',
      role: 'user',
    };
    const sampleConversationStreamEvent = {
      id: 'stream-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      contentBlockDeltaIndex: 0,
      contentBlockDoneAtIndex: undefined,
      contentBlockIndex: 0,
      contentBlockText: 'foo',
      stopReason: undefined,
      contentBlockToolUse: undefined,
    };
    // #endregion mocking common

    test('Send a message', async () => {
      // #region mocking
      const sampleSendMessageInput = {
        content: [{ text: 'foo' }],
        aiContext: { arbitrary: 'data' },
        toolConfiguration: {
          tools: {
            myTool: {
              inputSchema: {
                json: {
                  type: 'object',
                  properties: {
                    toolUseParam: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        } as const,
      };
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getConversation: sampleConversation,
          },
        },
        {
          data: {
            sendMessage: sampleConversationMessage1,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();
      // get conversation
      const { data: conversation } = await client.conversations.chatBot.get({
        id: sampleConversation.id,
      });
      // send conversation message
      const { data: message, errors: sendMessageErrors } =
        (await conversation?.sendMessage(sampleSendMessageInput)) ?? {};
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(sendMessageErrors).toBeUndefined();
      expect(message).toStrictEqual(sampleConversationMessage1);
      // #endregion assertions
    });

    test('List messages', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getConversation: sampleConversation,
          },
        },
        {
          data: {
            listMessages: {
              items: [sampleConversationMessage1, sampleConversationMessage2],
            },
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();
      // get conversation
      const { data: conversation } = await client.conversations.chatBot.get({
        id: sampleConversation.id,
      });
      // send conversation message
      const { data: messages, errors: listMessagesErrors } =
        (await conversation?.listMessages()) ?? {};
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(listMessagesErrors).toBeUndefined();
      expect(messages).toStrictEqual([
        sampleConversationMessage1,
        sampleConversationMessage2,
      ]);
      // #endregion assertions
    });

    test('Paginate messages', async () => {
      // #region mocking
      const sampleNextToken = 'next-token';
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getConversation: sampleConversation,
          },
        },
        {
          data: {
            listMessages: {
              items: [sampleConversationMessage1, sampleConversationMessage2],
              nextToken: sampleNextToken,
            },
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();
      // get conversation
      const { data: conversation } = await client.conversations.chatBot.get({
        id: sampleConversation.id,
      });
      // send conversation message
      const {
        data: messages,
        nextToken,
        errors: listMessagesErrors,
      } = (await conversation?.listMessages({
        limit: 100,
        nextToken: 'previous-next-token',
      })) ?? {};
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(listMessagesErrors).toBeUndefined();
      expect(messages).toStrictEqual([
        sampleConversationMessage1,
        sampleConversationMessage2,
      ]);
      expect(nextToken).toBe(sampleNextToken);
      // #endregion assertions
    });

    test('Subscribe to messages', async () => {
      // #region mocking
      const { spy, subSpy, subs, generateClient } = mockedGenerateClient([
        {
          data: {
            getConversation: sampleConversation,
          },
        },
        {
          data: {
            sendMessage: sampleConversationMessage1,
          },
        },
      ]);
      const mockHandler = jest.fn();
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking
      // #region api call
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();
      // get conversation
      const { data: conversation } = await client.conversations.chatBot.get({
        id: sampleConversation.id,
      });
      // subscribe to messages
      conversation?.onStreamEvent({
        next: (streamEvent) => {
          mockHandler(streamEvent);
        },
        error: () => {},
      });

      subs.onCreateAssistantResponseChatBot.next({
        data: {
          onCreateAssistantResponseChatBot: {
            ...sampleConversationStreamEvent,
          },
        },
      });

      await pause(1);
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(subOptionsAndHeaders(subSpy)).toMatchSnapshot();
      const {
        contentBlockText,
        contentBlockToolUse,
        ...rest
      } = sampleConversationStreamEvent;
      const expectedConversationStreamEvent = {
        text: contentBlockText,
        toolUse: contentBlockToolUse,
        ...rest,
      };
      expect(mockHandler).toHaveBeenCalledWith(expectedConversationStreamEvent);
      // #endregion assertions
    });

    test('Uses custom conversation handler', () => {
      const customConversationHandlerMock = {
        eventVersion: '1.0',
        getInstance: jest.fn()
      } as const;

      const schema = a.schema({
        SampleChat: a
          .conversation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'testSystemPrompt',
            handler: customConversationHandlerMock
          }),
      });

      const transformedSchema = schema.transform().schema;
      expect(transformedSchema).toMatchSnapshot();
      const expectedDirective = '@conversation(aiModel: "anthropic.claude-3-haiku-20240307-v1:0", systemPrompt: "testSystemPrompt", handler: { functionName: "FnSampleChat", eventVersion: "1.0" })';
      expect(transformedSchema).toContain(expectedDirective);
    });
  });
});
