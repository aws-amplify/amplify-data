import { a, type ClientSchema } from '@aws-amplify/data-schema';

const schema = a.schema({
  Author: a.model({
    name: a.string().required(),
    email: a.string(),
    posts: a.hasMany('Post', 'authorId'),
  }),
  Post: a.model({
    title: a.string().required(),
    description: a.string(),
    comments: a.hasMany('Comment', 'postId'),
    authorId: a.string(),
    author: a.belongsTo('Author', 'authorId'),
  }),
  Comment: a.model({
    content: a.string().required(),
    views: a.integer(),
    upvotes: a.integer(),
    postId: a.string().required(),
    post: a.belongsTo('Post', 'postId'),
  }),
});

export type Schema = ClientSchema<typeof schema>;
