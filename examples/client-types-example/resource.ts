import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    description: a.string(),
    comments: a.hasMany('Comment'),
  }),
  Comment: a.model({
    content: a.string().required(),
    post: a.belongsTo('Post'),
  }),
});

export type Schema = ClientSchema<typeof schema>;
