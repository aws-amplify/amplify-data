import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { generateClient } from 'aws-amplify/api';

bench('basic schema w client types', async () => {
  const schema = a
    .schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string().required(),
        postId: a.string().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
    })
    .authorization((allow) => [allow.guest()]);

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  // POST
  // query
  const _listPosts = await client.models.Post.list();
  const _getPost = await client.models.Post.get({ id: 'abc' });

  // mutation
  const _createPost = await client.models.Post.create({ title: 'hello' });
  const _updatePost = await client.models.Post.update({
    id: 'a1',
    title: 'goobye',
  });
  const _deletePost = await client.models.Post.delete({ id: 'a1' });

  // subscription
  client.models.Post.onCreate().subscribe({ next: () => null });
  client.models.Post.onUpdate().subscribe({ next: () => null });
  client.models.Post.onDelete().subscribe({ next: () => null });

  // COMMENT
  // query
  const _listComments = await client.models.Comment.list();
  const _getComment = await client.models.Comment.get({ id: 'abc' });

  // mutation
  const _createComment = await client.models.Comment.create({
    content: 'hello',
    postId: 'a1',
  });
  const _updateComment = await client.models.Comment.update({
    id: 'a1',
    content: 'goobye',
  });
  const _deleteComment = await client.models.Comment.delete({ id: 'a1' });

  // subscription
  client.models.Comment.onCreate().subscribe({ next: () => null });
  client.models.Comment.onUpdate().subscribe({ next: () => null });
  client.models.Comment.onDelete().subscribe({ next: () => null });
}).types([393112, 'instantiations']);
