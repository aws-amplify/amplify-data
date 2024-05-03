import { a, ClientSchema } from '../../src/index';
import { ClientExtensions } from '../../src/runtime';

describe('a', () => {
  test('b', async () => {
    const schema = a
      .schema({
        Status: a.enum(['a', 'b', 'c']),

        getStatus: a
          .query()
          .arguments({
            postId: a.id(),
          })
          .returns(a.ref('Status')),

        echo: a
          .query()
          .arguments({
            message: a.string(),
          })
          .returns(a.string()),

        LikeResult: a.customType({
          likes: a.integer().required(),
        }),

        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('LikeResult'))
          .handler(a.handler.function('likePost'))
          .authorization((allow) => [allow.publicApiKey()]),

        likeAllPosts: a
          .mutation()
          .returns(a.ref('LikeResult').array())
          .handler(a.handler.function('likeAllPosts'))
          .authorization((allow) => allow.publicApiKey()),

        onLikePost: a
          .subscription()
          .arguments({
            postId: a.id(),
          })
          .for(a.ref('likePost')),

        SomeThing: a.model({
          name: a.string(),
        }),

        Post: a
          .model({
            title: a.string().required(),
            description: a.string(),
            viewCount: a.integer(),
            updatedAt: a.string(),
            comments: a.hasMany('Comment', 'postId'),
          })
          .secondaryIndexes((index) => [
            index('title'),
            index('description')
              .queryField('myCustomIdx')
              .sortKeys(['updatedAt', 'viewCount']),
          ])
          .authorization((allow) => allow.publicApiKey()),

        Comment: a
          .model({
            cpkA: a.id().required(),
            cpkB: a.integer().required(),
            body: a.string().required(),
            postId: a.id(),
            post: a.belongsTo('Post', 'postId'),
            deletionState: a.enum(['active', 'deleted']),
          })
          .identifier(['cpkA', 'cpkB'])
          .authorization((allow) => [allow.publicApiKey()]),
      })
      .authorization((allow) => [
        allow.publicApiKey(),
        allow.groupDefinedIn('someGroupField'),
      ]);

    type Schema = ClientSchema<typeof schema>;
    type Comment = Schema['Comment']['type']['deletionState'];
    type CommentPK = Schema['Comment']['identifier'];
    type Post = Schema['Post']['type'];

    type Something = Schema['SomeThing']['type']['someGroupField'];

    type Status = Schema['Status']['type'];

    const _client = {} as ClientExtensions<Schema>;

    const status = _client.enums.Status.values();

    const { data: posts } = await _client.models.Post.list({
      filter: {
        or: [
          {
            description: {
              eq: 'something',
            },
          },
          {
            description: {
              eq: 'something else',
            },
          },
        ],
      },
    });

    const { data: created } = await _client.models.Comment.create({
      cpkA: '123',
      cpkB: 123,
      body: 'something',
      deletionState: 'active',
    });

    const { data: comment } = await _client.models.Comment.get({
      cpkA: 'sdf',
      cpkB: 123,
    });

    const { data: lazyComments } = await posts[0]!.comments();
    const lazyComment = lazyComments[0];
    const { data: lazyPost } = await lazyComment.post();

    const { data: echoResult } = await _client.queries.echo({
      message: 'something',
    });

    const { data: likeAllPostsResult } = await _client.mutations.likeAllPosts();
    const likes = likeAllPostsResult?.[0]?.likes;

    const { data: likePostResult } = await _client.mutations.likePost({
      postId: 'something',
    });
    const likes2 = likePostResult?.likes;

    _client.subscriptions.onLikePost({ postId: '123' }).subscribe({
      next(message) {
        console.log(message?.likes);
      },
    });
  });
});
