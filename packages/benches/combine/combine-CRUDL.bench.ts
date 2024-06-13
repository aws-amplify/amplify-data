import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { configure } from '@aws-amplify/data-schema/internals';
import { generateClient } from 'aws-amplify/api';

bench('combined SQL and DDB schema w client types', async () => {
  const fakeSecret = () => ({}) as any;

  // this would normally be defined in a separate auto-generated file and then imported into ./amplify/data/resource.ts,
  // but we're defining everything inside the fn block to make sure we get accurate instantiation count
  const sqlSchema = configure({
    database: {
      engine: 'mysql',
      connectionUri: fakeSecret(),
    },
  }).schema({
    post: a
      .model({
        id: a.string().required(),
        title: a.string(),
      })
      .identifier(['id']),
  });

  const ddbSchema = a
    .schema({
      Comment: a.model({
        content: a.string(),
        author: a.string(),
        postId: a.string(),
        post: a.belongsTo('post', 'postId'),
      }),
      Blog: a.model({
        title: a.string(),
      }),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn('author'),
      allow.publicApiKey().to(['read']),
    ]);

  const modifiedSql = sqlSchema
    .addMutations({
      mutation: a
        .mutation()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.boolean())
        .handler(a.handler.function('mutationFunction'))
        .authorization((allow) => allow.authenticated()),
    })
    .addQueries({
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.boolean())
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    })
    .setAuthorization((models) =>
      models.post.authorization((allow) => [
        allow.ownerDefinedIn('author'),
        allow.publicApiKey().to(['read']),
      ]),
    )
    .setRelationships((models) => [
      models.post.relationships({
        comments: a.hasMany('Comment', 'postId'),
      }),
    ]);

  const combinedSchema = a.combine([modifiedSql, ddbSchema]);
  type Schema = ClientSchema<typeof combinedSchema>;

  const client = generateClient<Schema>();

  const _posts = await client.models.post.list();

  const _newPost = await client.models.post.create({
    title: 'hello world',
  });
  const _updatedPost = await client.models.post.update({
    id: 'abc',
    title: 'updated',
  });
  const _deletedPost = await client.models.post.delete({ id: 'abc' });

  const _comments = await client.models.Comment.list();

  const _newComment = await client.models.Comment.create({
    content: 'hello world',
    author: 'bob dole',
  });
  const _updatedComment = await client.models.Comment.update({
    id: 'abc',
    content: 'updated',
  });
  const _deletedComment = await client.models.Comment.delete({ id: 'abc' });

  const _blogs = await client.models.Blog.list();

  const _newBlog = await client.models.Blog.create({
    title: 'hello world',
  });
  const _updatedBlog = await client.models.Blog.update({
    id: 'abc',
    title: 'updated',
  });
  const _deletedBlog = await client.models.Blog.delete({ id: 'abc' });
}).types([2047862, 'instantiations']);
