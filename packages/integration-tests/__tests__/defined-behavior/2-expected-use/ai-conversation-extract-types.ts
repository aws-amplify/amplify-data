import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('AI Conversation Routes', () => {
  const sampleConversation = { id: 'conversation-id' };
  // data/resource.ts
  const schema = a.schema({
    chatBot: a.conversation({
      aiModel: a.ai.model.claude3Haiku(),
      systemPrompt: 'You are a helpful chatbot.',
    }),
  });
  type Schema = ClientSchema<typeof schema>;

  beforeEach(async () => {
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`['ConversationName']`, () => {
    describe(`['type']`, () => {
      test(`matches 'create()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { createConversation: sampleConversation } },
        ]);
        const client = generateClient<Schema>();

        // The `chatBot` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `create`()`
        type ChatBotConversation = Schema['chatBot']['type'];
        const result = await client.conversations.chatBot.create();
        const _conversation: ChatBotConversation = result.data!;
      });

      test(`matches 'get()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { getConversation: sampleConversation } },
        ]);
        const client = generateClient<Schema>();

        // The `chatBot` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `create`()`
        type ChatBotConversation = Schema['chatBot']['type'];
        const result = await client.conversations.chatBot.get({
          id: 'conversation-id',
        });
        const _conversation: ChatBotConversation = result.data!;
      });

      test(`matches 'list()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          {
            data: { listConversation: { items: [sampleConversation] } },
          },
        ]);
        const client = generateClient<Schema>();

        // The `chatBot` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `list`()`
        type ChatBotConversation = Schema['chatBot']['type'];
        const result = await client.conversations.chatBot.list();
        const _conversations: ChatBotConversation[] = result.data!;
      });
    });

    describe(`['messageType']`, () => {
      const sampleConversationMessage = {
        content: [{ text: 'foo' }],
        conversationId: sampleConversation.id,
        createdAt: '2024-08-22T18:28:00.596Z',
        id: 'message-id',
        role: 'user',
      };

      test(`matches 'sendMessage()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { getConversation: sampleConversation } },
          { data: { sendMessage: sampleConversationMessage } },
        ]);
        const client = generateClient<Schema>();

        // The `chatBot` messageType can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `sendMessage`()`
        type ChatBotConversationMessage = Schema['chatBot']['messageType'];
        const { data: conversation } = await client.conversations.chatBot.get({
          id: 'conversation-id',
        });
        const result = await conversation!.sendMessage({
          content: sampleConversationMessage.content,
        });
        const _message: ChatBotConversationMessage = result.data!;
      });

      test(`matches 'listMessages()' result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { getConversation: sampleConversation } },
          { data: { listMessages: { items: [sampleConversationMessage] } } },
        ]);
        const client = generateClient<Schema>();

        // The `chatBot` messageType can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `list`()`
        type ChatBotConversationMessage = Schema['chatBot']['messageType'];
        const { data: conversation } = await client.conversations.chatBot.get({
          id: 'conversation-id',
        });
        const result = await conversation!.listMessages();
        const _messages: ChatBotConversationMessage[] = result.data!;
      });
    });
  });
});
