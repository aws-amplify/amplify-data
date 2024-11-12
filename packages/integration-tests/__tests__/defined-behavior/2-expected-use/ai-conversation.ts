import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  subOptionsAndHeaders,
  pause,
  expectSchemaFieldDirective,
} from '../../utils';
import { Subscriber } from 'rxjs';

describe('AI Conversation Routes', () => {
  // data/resource.ts
  const schema = a.schema({
    chatBot: a.conversation({
      aiModel: a.ai.model('Claude 3 Haiku'),
      systemPrompt: 'You are a helpful chatbot.',
    }).authorization((allow) => allow.owner()),
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
    const sampleConversationStreamTextEvent = {
      id: 'stream-text-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      contentBlockDeltaIndex: 0,
      contentBlockIndex: 0,
      contentBlockText: 'foo',
    };
    const sampleConversationStreamToolUseEvent = {
      id: 'stream-tooluse-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      contentBlockIndex: 0,
      contentBlockToolUse: {
        toolUseId: 'toolUseId',
        name: 'toolUseName',
        input: JSON.stringify({ toolUseParam: 'toolUseParam' }),
      },
    };
    const sampleConversationStreamDoneAtIndexEvent = {
      id: 'stream-doneatindex-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      contentBlockDoneAtIndex: 0,
      contentBlockIndex: 0,
    };
    const sampleConversationStreamTurnDoneEvent = {
      id: 'stream-turndone-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      contentBlockIndex: 0,
      stopReason: 'stopReason',
    };
    const sampleConversationStreamErrorEvent = {
      id: 'stream-error-event-id',
      conversationId: sampleConversation.id,
      associatedUserMessageId: sampleConversationMessage1.id,
      errors: [{ message: 'error message', errorType: 'errorType' }],
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

    describe('Stream events', () => {
      const mockNextHandler = jest.fn();
      const mockErrorHandler = jest.fn();
      let subs: Record<string, Subscriber<any>>;

      beforeAll(async () => {
        const { subs: mockedSubs, generateClient } = mockedGenerateClient([
          {
            data: {
              getConversation: sampleConversation,
            },
          },
        ]);
        subs = mockedSubs;

        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);

        const client = generateClient<Schema>();
        const { data: conversation } = await client.conversations.chatBot.get({
          id: sampleConversation.id,
        });
        // subscribe to messages
        conversation?.onStreamEvent({
          next: (streamEvent) => mockNextHandler(streamEvent),
          error: (error) => mockErrorHandler(error),
        });
      });

      test('Text event', async () => {
        subs.onCreateAssistantResponseChatBot.next({
          data: {
            onCreateAssistantResponseChatBot: {
              ...sampleConversationStreamTextEvent,
            },
          },
        });

        await pause(1);
        const {
          contentBlockText,
          ...rest
        } = sampleConversationStreamTextEvent;
        const expectedConversationStreamEvent = {
          text: contentBlockText,
          ...rest,
        };
        expect(mockNextHandler).toHaveBeenCalledWith(expectedConversationStreamEvent);
      });

      test('Tool use event', async () => {
        subs.onCreateAssistantResponseChatBot.next({
          data: {
            onCreateAssistantResponseChatBot: {
              ...sampleConversationStreamToolUseEvent,
            },
          },
        });

        await pause(1);
        const {
          contentBlockToolUse: { input, toolUseId, name },
          ...rest
        } = sampleConversationStreamToolUseEvent;
        const expectedConversationStreamEvent = {
          toolUse: { input: JSON.parse(input), toolUseId, name },
          ...rest,
        };
        expect(mockNextHandler).toHaveBeenCalledWith(expectedConversationStreamEvent);
      });

      test('Done at index event', async () => {
        subs.onCreateAssistantResponseChatBot.next({
          data: {
            onCreateAssistantResponseChatBot: {
              ...sampleConversationStreamDoneAtIndexEvent,
            },
          },
        });

        await pause(1);
        expect(mockNextHandler).toHaveBeenCalledWith(sampleConversationStreamDoneAtIndexEvent);
      });

      test('Turn done event', async () => {
        subs.onCreateAssistantResponseChatBot.next({
          data: {
            onCreateAssistantResponseChatBot: {
              ...sampleConversationStreamTurnDoneEvent,
            },
          },
        });

        await pause(1);
        expect(mockNextHandler).toHaveBeenCalledWith(sampleConversationStreamTurnDoneEvent);
      });

      test('Error event', async () => {
        subs.onCreateAssistantResponseChatBot.next({
          data: {
            onCreateAssistantResponseChatBot: {
              ...sampleConversationStreamErrorEvent,
            },
          },
        });

        await pause(1);
        expect(mockErrorHandler).toHaveBeenCalledWith(sampleConversationStreamErrorEvent);
      });
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
      const mockNextHandler = jest.fn();
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
          mockNextHandler(streamEvent);
        },
        error: () => { },
      });

      subs.onCreateAssistantResponseChatBot.next({
        data: {
          onCreateAssistantResponseChatBot: {
            ...sampleConversationStreamTextEvent,
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
        ...rest
      } = sampleConversationStreamTextEvent;
      const expectedConversationStreamEvent = {
        text: contentBlockText,
        ...rest,
      };
      expect(mockNextHandler).toHaveBeenCalledWith(expectedConversationStreamEvent);
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
          }).authorization((allow) => allow.owner()),
      });

      expectSchemaFieldDirective({
        schema: schema.transform().schema,
        model: 'Mutation',
        field: 'SampleChat',
        directive: [
          '@conversation(',
          'aiModel: "anthropic.claude-3-haiku-20240307-v1:0", ',
          'systemPrompt: "testSystemPrompt", ',
          'auth: {strategy: owner, provider: userPools}, ',
          'handler: {functionName: "FnSampleChat", eventVersion: "1.0"}',
          ')',
        ].join(''),
      });

      expectSchemaFieldDirective({
        schema: schema.transform().schema,
        model: 'Mutation',
        field: 'SampleChat',
        directive: '@aws_cognito_user_pools',
      });
    });
  });

  describe('Invalid authorization definitions', () => {
    const input = {
      aiModel: a.ai.model('Claude 3 Haiku'),
      systemPrompt: 'testSystemPrompt',
    };

    test('Invalid auth strategy on field', () => {
      expect(() =>
        a.schema({
          SampleChat: a.conversation(input)
            // @ts-expect-error
            .authorization((allow) => allow.authenticated())
        })
      ).toThrow();
    });

    test('Missing auth strategy on field, no schema auth', () => {
      expect(() =>
        a.schema({
          SampleChat: a.conversation(input)
        }).transform()
      ).toThrow();
    });

    test('Missing auth strategy on field, schema auth', () => {
      expect(() =>
        a.schema({
          SampleChat: a.conversation(input)
        })
          .authorization((allow) => allow.authenticated())
          .transform()
      ).toThrow();
    });
  });

  describe('Conversation tools', () => {
    test('generated model list query tool', () => {
      const schema = a.schema({
        MyModel: a.model({
          name: a.string(),
        })
          .authorization((allow) => allow.owner()),

        chatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'You are a helpful chatbot.',
          tools: [
            a.ai.dataTool({
              name: 'myTool',
              description: 'does a thing',
              model: a.ref('MyModel'),
              operation: 'list',
            }),
          ],
        })
          .authorization((allow) => allow.owner())
      });

      expectSchemaFieldDirective({
        schema: schema.transform().schema,
        model: 'Mutation',
        field: 'chatBot',
        directive: [
          '@conversation(',
          'aiModel: "anthropic.claude-3-haiku-20240307-v1:0", ',
          'systemPrompt: "You are a helpful chatbot.", ',
          'auth: {strategy: owner, provider: userPools}, ',
          'tools: [{name: "myTool", description: "does a thing", modelName: "MyModel", modelOperation: list}]',
          ')',
        ].join(''),
      });
    });

    test('custom query tool', () => {
      const schema = a.schema({
        FooBar: a.customType({
          foo: a.string(),
          bar: a.integer(),
        }),
        myToolQuery: a.query()
          .arguments({
            input: a.string(),
          })
          .returns(a.ref('FooBar'))
          .handler(a.handler.function('fakeHandler'))
          .authorization((allow) => allow.authenticated()),

        chatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'You are a helpful chatbot.',
          tools: [
            a.ai.dataTool({
              name: 'myTool',
              description: 'does a thing',
              query: a.ref('myToolQuery'),
            }),
          ],
        })
          .authorization((allow) => allow.owner())
      });

      expectSchemaFieldDirective({
        schema: schema.transform().schema,
        model: 'Mutation',
        field: 'chatBot',
        directive: [
          '@conversation(',
          'aiModel: "anthropic.claude-3-haiku-20240307-v1:0", ',
          'systemPrompt: "You are a helpful chatbot.", ',
          'auth: {strategy: owner, provider: userPools}, ',
          'tools: [{name: "myTool", description: "does a thing", queryName: "myToolQuery"}]',
          ')',
        ].join(''),
      });
    });

    test('model and query tools', () => {
      const schema = a.schema({
        MyModel: a.model({
          name: a.string(),
        })
          .authorization((allow) => allow.owner()),

        FooBar: a.customType({
          foo: a.string(),
          bar: a.integer(),
        }),
        myToolQuery: a.query()
          .arguments({
            input: a.string(),
          })
          .returns(a.ref('FooBar'))
          .handler(a.handler.function('fakeHandler'))
          .authorization((allow) => allow.authenticated()),

        chatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'You are a helpful chatbot.',
          tools: [
            a.ai.dataTool({
              name: 'myTool',
              description: 'does a thing',
              model: a.ref('MyModel'),
              operation: 'list',
            }),
            a.ai.dataTool({
              name: 'myTool2',
              description: 'does a different thing',
              query: a.ref('myToolQuery'),
            }),
          ],
        }).authorization((allow) => allow.owner())
      });

      expectSchemaFieldDirective({
        schema: schema.transform().schema,
        model: 'Mutation',
        field: 'chatBot',
        directive: [
          '@conversation(',
          'aiModel: "anthropic.claude-3-haiku-20240307-v1:0", ',
          'systemPrompt: "You are a helpful chatbot.", ',
          'auth: {strategy: owner, provider: userPools}, ',
          'tools: [',
          '{name: "myTool", description: "does a thing", modelName: "MyModel", modelOperation: list}, ',
          '{name: "myTool2", description: "does a different thing", queryName: "myToolQuery"}',
          ']',
          ')',
        ].join(''),
      });
    });

    describe('invalid tool definitions', () => {
      test('invalid tool name', () => {
        const schema = a.schema({
          invalidChatName: a.conversation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'You are a helpful chatbot.',
            tools: [
              a.ai.dataTool({
                name: 'abc-123',
                description: 'does a thing',
                model: a.ref('MyModel'),
                operation: 'list',
              }),
            ],
          })
          .authorization((allow) => allow.owner())
        });

        expect(() => schema.transform())
          .toThrow('Tool name must start with a letter and contain only letters, numbers, and underscores. Found: abc-123');
      });

      test('mixing model and query tools', () => {
        a.schema({
          invalidToolDefinition: a.conversation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'You are a helpful chatbot.',
            tools: [
              // @ts-expect-error
              a.ai.dataTool({
                name: 'myTool',
                description: 'does a thing',
                query: a.ref('myToolQuery'),
                model: a.ref('MyModel'),
                operation: 'list',
              }),
            ],
          })
          .authorization((allow) => allow.owner())
        });
      });
    });
  });
});
