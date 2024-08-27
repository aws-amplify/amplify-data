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
      Comment: a.model({
        postId: a.string(),
        post: a.belongsTo('Post', 'postId'),
        meta: a.hasOne('CommentMeta', 'commentId'),
      }),
      // .disableOperations(['queries'])
      CommentMeta: a.model({
        commentId: a.string(),
        comment: a.belongsTo('Comment', 'commentId'),
      }),
      // .disableOperations(['get'])
      ReadOnly: a
        .model({
          data: a.json(),
        })
        .disableOperations(['mutations']),
      FineGrained: a
        .model({
          data: a.json(),
        })
        .disableOperations(['get', 'create', 'onCreate']),
    })
    .authorization((allow) => allow.guest());

  type Schema = ClientSchema<typeof schema>;

  test('disabled coarse-grained methods are undefined in the client types and at runtime', async () => {
    const { generateClient } = mockedGenerateClient([]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    expect(() => {
      // @ts-expect-error
      client.models.Post.onCreate();
    }).toThrowError('client.models.Post.onCreate is not a function');

    expect(() => {
      // @ts-expect-error
      client.models.Post.onUpdate({ id: 'abc' });
    }).toThrowError('client.models.Post.onUpdate is not a function');

    expect(() => {
      // @ts-expect-error
      client.models.Post.onDelete({ id: 'abc' });
    }).toThrowError('client.models.Post.onDelete is not a function');

    expect(() => {
      // // @ts-expect-error
      client.models.Comment.get({ id: 'abc' });
    }).toThrowError('client.models.Comment.get is not a function');

    expect(() => {
      // // @ts-expect-error
      client.models.Comment.list();
    }).toThrowError('client.models.Comment.list is not a function');

    expect(() => {
      // // @ts-expect-error - observeQuery is disabled if queries and/or subscriptions are disabled on the model
      client.models.Comment.observeQuery();
    }).toThrowError('client.models.Comment.observeQuery is not a function');

    expect(() => {
      // @ts-expect-error
      client.models.ReadOnly.create({});
    }).toThrowError('client.models.ReadOnly.create is not a function');

    expect(() => {
      // @ts-expect-error
      client.models.ReadOnly.update({});
    }).toThrowError('client.models.ReadOnly.update is not a function');

    expect(() => {
      // @ts-expect-error
      client.models.ReadOnly.delete({});
    }).toThrowError('client.models.ReadOnly.delete is not a function');

    // enabled because only mutations are disabled on this model
    client.models.ReadOnly.observeQuery();
  });

  test('disabled fine-grained methods are undefined in the client types and at runtime', async () => {
    const { generateClient } = mockedGenerateClient([
      {
        data: {
          listFineGrained: {
            __typeName: 'FineGrained',
            id: 'a1',
            data: '',
            updatedAt: '2024-08-07T19:05:44.536Z',
            createdAt: '2024-09-07T18:05:44.536Z',
          },
        },
      },
      {
        data: {
          deleteFineGrained: {
            __typeName: 'FineGrained',
            id: 'a1',
            data: '',
            updatedAt: '2024-08-07T19:05:44.536Z',
            createdAt: '2024-09-07T18:05:44.536Z',
          },
        },
      },
    ]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    expect(() => {
      // @ts-expect-error
      client.models.FineGrained.get({});
    }).toThrowError('client.models.FineGrained.get is not a function');

    await client.models.FineGrained.list();

    expect(() => {
      // @ts-expect-error
      client.models.FineGrained.create({});
    }).toThrowError('client.models.FineGrained.create is not a function');

    await client.models.FineGrained.delete({ id: 'a1' });

    expect(() => {
      // @ts-expect-error
      client.models.FineGrained.onCreate();
    }).toThrowError('client.models.FineGrained.onCreate is not a function');

    client.models.FineGrained.onDelete();
    client.models.FineGrained.onUpdate();
  });

  test('hasMany relational lazy loaders remain available even if queries are disabled for model', async () => {
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

  test.only('belongsTo/hasOne relational lazy loaders remain available even if queries are disabled for model', async () => {
    const { generateClient } = mockedGenerateClient([
      {
        data: {
          listCommentMeta: [
            {
              __typeName: 'CommentMeta',
              id: 'cm1',
              commentId: 'c1',
              updatedAt: '2024-08-07T19:05:44.536Z',
              createdAt: '2024-09-07T18:05:44.536Z',
            },
          ],
        },
      },
      {
        data: {
          getComment: {
            __typeName: 'Comment',
            id: 'c1',
            postId: 'p1',
            updatedAt: '2024-08-07T19:05:44.536Z',
            createdAt: '2024-09-07T18:05:44.536Z',
          },
        },
      },
      {
        data: {
          getCommentMeta: {
            __typeName: 'CommentMeta',
            id: 'cm1',
            commentId: 'c1',
            updatedAt: '2024-08-07T19:05:44.536Z',
            createdAt: '2024-09-07T18:05:44.536Z',
          },
        },
      },
    ]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    const { data: cm } = await client.models.CommentMeta.get({ id: 'c1' });

    const { data: comment } = await cm!.comment();

    const { data: cm2 } = await comment!.meta();

    expect(comment!.id).toEqual('c1');

    expect(cm2!.id).toEqual('cm1');
  });
});
