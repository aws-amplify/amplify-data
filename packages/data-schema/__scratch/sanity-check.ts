import { a, ClientSchema } from '../src';
import { ClientSchemaByEntityType } from '../src/ClientSchema';
import { ClientExtensions } from '../src/runtime';
import { ExtractNestedTypes } from '../src/ClientSchema/utilities/ExtractNestedTypes';
import { Prettify, Expect, Equal } from '@aws-amplify/data-schema-types';
import { Select } from '../src/util';
import { CustomType } from '../src/CustomType';
import { ResolvedModel } from '../src/runtime/client/index';

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
          test: a.string(),
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

        SomeThing: a
          .model({
            name: a.string(),
            deletionState: a.enum(['active', 'deleted']),
            status: a.ref('Status').required(),
            likes: a.ref('LikeResult').array(),
            nestedModelThing: a.customType({
              details: a.string(),
            }),
            otherStuff: a.json(),
          })
          .secondaryIndexes((index) => [index('name').sortKeys(['status'])]),

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
          })
          .identifier(['cpkA', 'cpkB'])
          .authorization((allow) => [allow.publicApiKey()]),

        InputTypesCheck: a.model({
          title: a.string().required(),
          meta: a.customType({
            author: a.string().required(),
            summary: a.string(),
          }),
        }),

        RequiredId: a.model({
          id: a.id().required(),
          content: a.string(),
          metadata: a.json(),
        }),

        Office: a
          .model({
            id: a.id().required(),
            locationId: a.string().required(),
            name: a.string().required(),
            doctors: a.hasMany('Doctor', ['officeId', 'officeLocationId']),
          })
          .identifier(['id', 'locationId']),
      })
      .authorization((allow) => [
        allow.publicApiKey(),
        allow.groupDefinedIn('someGroupField'),
      ]);

    type Schema = ClientSchema<typeof schema>;

    type T = Schema['RequiredId']['createType'];
    type ID = Prettify<Schema['RequiredId']['identifier']>;

    const _client = {} as ClientExtensions<Schema>;

    _client.models.SomeThing.listSomeThingByNameAndStatus({
      name: 'something',
      status: { eq: 'a' },
    });

    const status = _client.enums.SomeThingDeletionState.values();

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
