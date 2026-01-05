import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { generateClient } from 'aws-amplify/api';

bench('uni-directional - no sel. set', async () => {
  const schema = a
    .schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        // post: a.belongsTo('Post', 'postId'), //this is an invalid definition, but using it to test perf deg.
        postId: a.string(),
      }),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  const _res = await client.models.Post.list();
}).types([18897, 'instantiations']);

bench('bi-directional - no sel. set', async () => {
  const schema = a
    .schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post', 'postId'), //this is an invalid definition, but using it to test perf deg.
        postId: a.string(),
      }),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  const _res = await client.models.Post.list();
}).types([19244, 'instantiations']);

bench('uni-directional', async () => {
  const schema = a
    .schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        // post: a.belongsTo('Post', 'postId'), //this is an invalid definition, but using it to test perf deg.
        postId: a.string(),
      }),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  const _res = await client.models.Post.list({
    selectionSet: ['id', 'title'],
  });
}).types([36516, 'instantiations']);

bench('bi-directional', async () => {
  const schema = a
    .schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post', 'postId'),
        postId: a.string(),
      }),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  const _res = await client.models.Post.list({
    selectionSet: ['id', 'title', 'comments.*'],
  });
}).types([44260, 'instantiations']);
