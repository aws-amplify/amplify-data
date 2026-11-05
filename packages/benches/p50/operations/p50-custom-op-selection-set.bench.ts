import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

bench('custom ops returning models; default selection set', async () => {
  const schema = a
    .schema({
      Author: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'authorId'),
      }),
      Post: a.model({
        title: a.string().required(),
        authorId: a.id().required(),
        author: a.belongsTo('Author', 'authorId'),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        body: a.string().required(),
        postId: a.id().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
      getFeaturedPost: a
        .query()
        .arguments({ slug: a.string().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function('fn')),
      listFeaturedPosts: a
        .query()
        .returns(a.ref('Post').array())
        .handler(a.handler.function('fn')),
      likePost: a
        .mutation()
        .arguments({ postId: a.id().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function('fn')),
      onLikePost: a
        .subscription()
        .for(a.ref('likePost'))
        .handler(a.handler.function('fn')),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  await client.queries.getFeaturedPost({ slug: 'x' });
  await client.queries.listFeaturedPosts();
  await client.mutations.likePost({ postId: 'x' });
  client.subscriptions.onLikePost().subscribe({ next() {} });
}).types([52514, 'instantiations']);

bench('custom ops returning models; custom selection set', async () => {
  const schema = a
    .schema({
      Author: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'authorId'),
      }),
      Post: a.model({
        title: a.string().required(),
        authorId: a.id().required(),
        author: a.belongsTo('Author', 'authorId'),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        body: a.string().required(),
        postId: a.id().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
      getFeaturedPost: a
        .query()
        .arguments({ slug: a.string().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function('fn')),
      listFeaturedPosts: a
        .query()
        .returns(a.ref('Post').array())
        .handler(a.handler.function('fn')),
      likePost: a
        .mutation()
        .arguments({ postId: a.id().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function('fn')),
      onLikePost: a
        .subscription()
        .for(a.ref('likePost'))
        .handler(a.handler.function('fn')),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  await client.queries.getFeaturedPost(
    { slug: 'x' },
    { selectionSet: ['id', 'title', 'comments.*'] },
  );
  await client.queries.listFeaturedPosts({
    selectionSet: ['id', 'title', 'author.*'],
  });
  await client.mutations.likePost(
    { postId: 'x' },
    { selectionSet: ['id', 'author.posts.*'] },
  );
  client.subscriptions
    .onLikePost({ selectionSet: ['id', 'title'] })
    .subscribe({ next() {} });
}).types([54157, 'instantiations']);
