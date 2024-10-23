import { a } from '@aws-amplify/data-schema';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    description: a.string(),
    comments: a.hasMany('Comment', 'postId'),
  }),
  Comment: a.model({
    content: a.string().required(),
    views: a.integer(),
    upvotes: a.integer(),
    postId: a.string().required(),
    post: a.belongsTo('Post', 'postId'),
  }),
});
