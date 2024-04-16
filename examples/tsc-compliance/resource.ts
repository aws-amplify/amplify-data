import { a, ClientSchema } from '@aws-amplify/data-schema';

const schema = a.schema({
  Post: a
    .model({
      title: a
        .string()
        .required()
        .authorization((allow) => [
          allow.owner().to(['create', 'read', 'update']),
          allow.publicApiKey().to(['read']),
        ]),
      description: a.string().default('My new post'),
      comments: a.hasMany('Comment', 'postId'),
      location: a.ref('Location'),
      privacy: a.ref('Privacy'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  Comment: a
    .model({
      content: a.string(),
      postId: a.id(),
      post: a.belongsTo('Post', 'postId'),
      commentStatus: a.enum(['submitted', 'approved']),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  Location: a.customType({
    lat: a.float(),
    long: a.float(),
  }),

  Privacy: a.enum(['public', 'protected', 'private']),
});

export type Schema = ClientSchema<typeof schema>;
