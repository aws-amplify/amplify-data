import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

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
        // [Field-level authorization rule]
        // This auth rule will be used for the "ssn" field
        // All other fields will use the model-level auth rule
        ssn: a.string().authorization([a.allow.owner()]),
        todos: a.hasMany('Todo'),
        posts: a.hasMany('Post'),
        // [Model-level authorization rule]
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    // Because no model-level authorization rule is present
    // this model will use the global authorization rule.
    Todo: a
      .model({
        todoId: a.id().required(),
        name: a.string().required(),
        privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
        viewCount: a.integer(),
        complete: a.boolean(),
        employee: a.belongsTo('Employee'),
      })
      // Composite identifier
      .identifier(['todoId', 'name']),
    Post: a
      .model({
        name: a.string().default('My new Post'),
        notes: a.string().array(),
        // Custom type
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
        lastViewedDate: a.date(),
        lastViewedTime: a.time(),
        employee: a.belongsTo('Employee'),
      })
      .authorization([
        // Allow anyone auth'd with an API key to read everyone's posts.
        a.allow.public().to(['read']),
        // Allow signed-in user to create, read, update,
        // and delete their __OWN__ posts.
        a.allow.owner(),
      ]),
    // [Global authorization rule]
  }).authorization([a.allow.public()]);
}).types([20578, 'instantiations']);

bench('p50 w/ client types', () => {
  const s = a
    .schema({
      Employee: a
        .model({
          name: a.string().required(),
          email: a.email().authorization([a.allow.owner()]),
          phone: a.phone().authorization([a.allow.owner()]),
          website: a.url(),
          // [Field-level authorization rule]
          // This auth rule will be used for the "ssn" field
          // All other fields will use the model-level auth rule
          ssn: a.string().authorization([a.allow.owner()]),
          todos: a.hasMany('Todo'),
          posts: a.hasMany('Post'),
          // [Model-level authorization rule]
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      // Because no model-level authorization rule is present
      // this model will use the global authorization rule.
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employee: a.belongsTo('Employee'),
        })
        // Composite identifier
        .identifier(['todoId', 'name']),
      Post: a
        .model({
          name: a.string().default('My new Post'),
          notes: a.string().array(),
          // Custom type
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
          lastViewedDate: a.date(),
          lastViewedTime: a.time(),
          employee: a.belongsTo('Employee'),
        })
        .authorization([
          // Allow anyone auth'd with an API key to read everyone's posts.
          a.allow.public().to(['read']),
          // Allow signed-in user to create, read, update,
          // and delete their __OWN__ posts.
          a.allow.owner(),
        ]),
      // [Global authorization rule]
    })
    .authorization([a.allow.public()]);

  type _ = ClientSchema<typeof s>;
}).types([460912, 'instantiations']);
