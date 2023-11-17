import { a, ClientSchema } from '@aws-amplify/data-schema';

const schema = a.schema({
  Post: a
    .model({
      title: a
        .string()
        .required()
        .authorization([
          a.allow.owner().to(['create', 'read', 'update']),
          a.allow.public().to(['read']),
        ]),
      description: a.string().default('My new post'),
      comments: a.hasMany('Comment'),
      location: a.ref('Location'),
      privacy: a.ref('Privacy'),
    })
    .authorization([a.allow.owner(), a.allow.public().to(['read'])]),

  Comment: a
    .model({
      content: a.string(),
      post: a.belongsTo('Post'),
      commentStatus: a.enum(['submitted', 'approved']),
    })
    .authorization([a.allow.owner(), a.allow.public().to(['read'])]),

  Location: a.customType({
    lat: a.float(),
    long: a.float(),
  }),

  Privacy: a.enum(['public', 'protected', 'private']),
});

export type Schema = ClientSchema<typeof schema>;
