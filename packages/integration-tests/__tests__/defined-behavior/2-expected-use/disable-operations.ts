import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('disable model operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const schema = a
    .schema({
      Post: a
        .model({
          title: a.string(),
          description: a.string(),
          comments: a.hasMany('Comment', 'postId'),
        })
        .disableOperations(['subscriptions']),
      Comment: a
        .model({
          postId: a.string(),
          post: a.belongsTo('Post', 'postId'),
        })
        .disableOperations(['queries']),
      ReadOnly: a
        .model({
          data: a.json(),
        })
        .disableOperations(['mutations']),
    })
    .authorization((allow) => allow.guest());

  type Schema = ClientSchema<typeof schema>;

  test('disabled methods are undefined in the client types', async () => {
    const { generateClient } = mockedGenerateClient([]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    // console.log(
    //   'attrs',
    //   JSON.stringify(config.modelIntrospection.models.Comment, null, 2),
    // );

    expect(() => {
      // @ts-expect-error
      client.models.Post.onCreate();
    }).toThrow();

    expect(() => {
      // @ts-expect-error
      client.models.Post.onUpdate({ id: 'abc' });
    }).toThrow();

    expect(() => {
      // @ts-expect-error
      client.models.Post.onDelete({ id: 'abc' });
    }).toThrow();

    expect(() => {
      // @ts-expect-error
      client.models.Comment.get({ id: 'abc' });
    }).toThrow();

    expect(() => {
      // @ts-expect-error
      client.models.Comment.list();
    }).toThrow();

    expect(() => {
      // @ts-expect-error - observeQuery is disabled if queries and/or subscriptions are disabled on the model
      client.models.Comment.observeQuery();
    }).toThrow();

    // enabled because only mutations are disabled on this model
    client.models.ReadOnly.observeQuery();
  });

  /* TODO - omitting list in the runtime client breaks lazy loaders. Need to figure out another way to set those  */

  test('relational lazy loaders remain available even if queries are disabled for model', async () => {
    const { generateClient } = mockedGenerateClient([
      {
        data: {
          getPost: {
            __typeName: 'Post',
            id: 'a1',
            title: 'Hello',
            description: 'Some Description',
            updatedAt: '2024-08-07T19:05:44.536Z',
            createdAt: '2024-09-07T18:05:44.536Z',
          },
        },
      },
      {
        data: {
          listComments: [],
        },
      },
    ]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data: post } = await client.models.Post.get({ id: 'a1' });
    const { data: comment } = await post!.comments();

    expect(comment).toEqual([]);
  });
});
