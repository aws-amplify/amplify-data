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
        email: a.email().authorization([a.allow.owner()]),
        phone: a.phone().authorization([a.allow.owner()]),
        website: a.url(),
        ssn: a.string().authorization([a.allow.owner()]),
        todos: a.hasMany('Todo', ['employeeId']),
        posts: a.hasMany('Post', ['employeeId']),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
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
      .authorization([a.allow.public().to(['read']), a.allow.owner()]),
  }).authorization([a.allow.public()]);
}).types([27024, 'instantiations']);

bench('p50 w/ client types', () => {
  const s = a
    .schema({
      Employee: a
        .model({
          name: a.string().required(),
          email: a.email().authorization([a.allow.owner()]),
          phone: a.phone().authorization([a.allow.owner()]),
          website: a.url(),
          ssn: a.string().authorization([a.allow.owner()]),
          todos: a.hasMany('Todo', ['employeeId']),
          posts: a.hasMany('Post', ['employeeId']),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
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
        .authorization([a.allow.public().to(['read']), a.allow.owner()]),
    })
    .authorization([a.allow.public()]);

  type _ = ClientSchema<typeof s>;
}).types([105737, 'instantiations']);

bench('p50 combined schema w/ client types', () => {
  const s1 = a
    .schema({
      Employee: a
        .model({
          name: a.string().required(),
          email: a.email().authorization([a.allow.owner()]),
          phone: a.phone().authorization([a.allow.owner()]),
          website: a.url(),
          ssn: a.string().authorization([a.allow.owner()]),
          todos: a.hasMany('Todo', ['employeeId']),
          posts: a.hasMany('Post', ['employeeId']),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

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
        .authorization([a.allow.public().to(['read']), a.allow.owner()]),
    })
    .authorization([a.allow.public()]);

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
}).types([443356, 'instantiations']);
