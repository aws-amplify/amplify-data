import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a
  .schema({
    Employee: a
      .model({
        name: a.string().required(),
        email: a.email().authorization((allow) => allow.owner()),
        phone: a.phone().authorization((allow) => allow.owner()),
        website: a.url(),
        ssn: a.string().authorization((allow) => allow.owner()),
        todos: a.hasMany('Todo', ['employeeId']),
        posts: a.hasMany('Post', ['employeeId']),
      })
      .authorization((allow) => [
        allow.authenticated().to(['read']),
        allow.owner(),
      ]),
    Todo: a
      .model({
        todoId: a.id().required(),
        name: a.string().required(),
        privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
        viewCount: a.integer(),
        complete: a.boolean(),
        employeeId: a.id(),
        employee: a.belongsTo('Employee', ['employeeId']),
      })
      .identifier(['todoId', 'name']),
    Post: a
      .model({
        name: a.string().default('My new Post'),
        notes: a.string().array(),
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
        lastViewedDate: a.date(),
        lastViewedTime: a.time(),
        employeeId: a.id(),
        employee: a.belongsTo('Employee', ['employeeId']),
      })
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.owner(),
      ]),
    Cart: a
      .model({
        items: a.string().required().array(),
        customerId: a.id(),
        customer: a.belongsTo('Customer', 'customerId'),
      })
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.owner(),
      ]),
    Customer: a
      .model({
        name: a.string(),
        activeCart: a.hasOne('Cart', 'customerId'),
      })
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.owner(),
      ]),
  })
  .authorization((allow) => allow.publicApiKey());

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 2,
    },
  },
});
