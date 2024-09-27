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
        await client.conversations.chatBot.create();
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
        onMessage: expect.any(Function),
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
        onMessage: expect.any(Function),
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
          onMessage: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2023-08-02T12:00:00Z',
        },
        {
          createdAt: '2024-09-02T12:00:00Z',
          id: sampleConversation2.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation2',
          onMessage: expect.any(Function),
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
          onMessage: expect.any(Function),
          sendMessage: expect.any(Function),
          updatedAt: '2023-08-02T12:00:00Z',
        },
        {
          createdAt: '2024-09-02T12:00:00Z',
          id: sampleConversation2.id,
          listMessages: expect.any(Function),
          metadata: {},
          name: 'Test Conversation2',
          onMessage: expect.any(Function),
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
      conversation?.onMessage((message) => {
        mockHandler(message);
      });

      subs.onCreateAssistantResponseChatBot.next({
        data: {
          onCreateAssistantResponseChatBot: {
            ...sampleConversationMessage1,
            role: 'assistant',
          },
        },
      });

      await pause(1);
      // #endregion api call
      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(subOptionsAndHeaders(subSpy)).toMatchSnapshot();
      expect(mockHandler).toHaveBeenCalledWith({
        ...sampleConversationMessage1,
        role: 'assistant',
      });
      // #endregion assertions
    });
  });
});
