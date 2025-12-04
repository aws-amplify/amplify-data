import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

/**
 * The following benchmarks are for testing ~p50 schemas. Our assumption around
 * what is a "p50" is: 3 models, 5 fields each, all connected with
 * relationships, 2 auth rules, and at least 1 field-level auth rule.
 */
bench('p50', () => {
  a.schema({
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
  }).authorization((allow) => allow.publicApiKey());
}).types([15283, 'instantiations'][(15283, 'instantiations')]);

bench('p50 w/ client types', () => {
  const s = a
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
    })
    .authorization((allow) => allow.publicApiKey());

  type _ = ClientSchema<typeof s>;
}).types([17618, 'instantiations'][(17618, 'instantiations')]);

bench('p50 combined schema w/ client types', () => {
  const s1 = a
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
    })
    .authorization((allow) => allow.publicApiKey());

  const s2 = a.schema({
    Todo: a
      .model({
        todoId: a.id().required(),
        name: a.string().required(),
        privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
        viewCount: a.integer(),
        complete: a.boolean(),
        employee: a.belongsTo('Employee', ['employeeId']),
      })
      .identifier(['todoId', 'name']),
  });

  const s = a.combine([s1, s2]);
  type _ = ClientSchema<typeof s>;
}).types([21264, 'instantiations'][(21264, 'instantiations')]);
