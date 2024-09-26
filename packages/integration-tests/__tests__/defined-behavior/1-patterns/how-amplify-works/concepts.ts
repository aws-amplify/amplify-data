import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  parseQuery,
  parseGraphqlSchema,
  expectSchemaModelContains,
  expectSchemaModelExcludes,
  expectSelectionSetContains,
  expectVariables,
  expectGraphqlMatches,
} from '../../../utils';

describe('Implicit Auth Field Handling. Given:', () => {
  describe('A model with implicit owner field from owner auth', () => {
    // #region covers 821a39b70747c164
    const schema = a
      .schema({
        Chat: a.model({
          name: a.string(),
          message: a.hasMany('Message', 'chatId'),
        }),
        Message: a.model({
          text: a.string(),
          chat: a.belongsTo('Chat', 'chatId'),
          chatId: a.id(),
        }),
      })
      .authorization((allow) => allow.owner());
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client can list and create ', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listMessages: {
              items: [
                {
                  id: 'some-message-id',
                  text: 'this is a message',
                  chatId: 'some-chat-id',
                },
              ],
            },
          },
        },
        {
          data: {
            createMessage: {
              id: 'some-new-message-id',
              text: 'My message text',
              chatId: null,
            },
          },
        },
      ]);

      // #region covers b9d80a938dc6ed37
      // generate your data client using the Schema from your backend
      const client = generateClient<Schema>();

      // list all messages
      const { data } = await client.models.Message.list();

      // create a new message
      const { errors, data: newMessage } = await client.models.Message.create({
        text: 'My message text',
      });
      // #endregion

      const calls = optionsAndHeaders(spy);

      const listQuery = calls[0][0].query;
      expectGraphqlMatches(
        listQuery,
        `query ($filter: ModelMessageFilterInput, $limit: Int,$nextToken: String) {
          listMessages (filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
              id text chatId createdAt updatedAt owner
            }
            nextToken __typename
          }
        }`,
      );
      expect(data[0]).toEqual(
        expect.objectContaining({
          id: 'some-message-id',
          text: 'this is a message',
          chatId: 'some-chat-id',
        }),
      );

      const createQuery = calls[1][0].query;
      expectGraphqlMatches(
        createQuery,
        `mutation ($input: CreateMessageInput!) {
          createMessage (input: $input) {
            id text chatId createdAt updatedAt owner
          }
        }`,
      );
      expect(newMessage).toEqual(
        expect.objectContaining({
          id: 'some-new-message-id',
          text: 'My message text',
          chatId: null,
        }),
      );
    });
  });
});
