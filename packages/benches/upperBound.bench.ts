import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

/**
 * The following benchmarks are for testing ~p50 schemas.
 * A p50 of 3 models, 5 fields, all connected with relationships, and 2 auth rules
 * and at least 1 field-level auth rule
 */
bench('p50', () => {
  a.schema({
    // Because no model-level authorization rule is present
    // this model will use the global authorization rule.
    Todo: a
      .model({
        todoId: a.id().required(),
        name: a.string().required(),
        privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
        viewCount: a.integer(),
        complete: a.boolean(),
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
      })
      .authorization([
        // Allow anyone auth'd with an API key to read everyone's posts.
        a.allow.public().to(['read']),
        // Allow signed-in user to create, read, update,
        // and delete their __OWN__ posts.
        a.allow.owner(),
      ]),
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
      })

      // [Model-level authorization rule]
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    // [Global authorization rule]
  }).authorization([a.allow.public()]);
}).types([17729, 'instantiations']);

//endregion

/**
 * The following benchmarks are for testing ~p90 schemas. TODO: add more
 */
//region upper-bound
bench(
  'WIP - upper-bound schema w/ client types - X models with Y fields each',
  () => {
    const s = a.schema({
      Model1: a.model({
        field1: a.string().required(),
      }),
      Model2: a.model({
        field2: a.string().required(),
      }),
      Model3: a.model({
        field3: a.string().required(),
      }),
      Model4: a.model({
        field4: a.string().required(),
      }),
      Model5: a.model({
        field5: a.string().required(),
      }),
      Model6: a.model({
        field6: a.string().required(),
      }),
      Model7: a.model({
        field7: a.string().required(),
      }),
      Model8: a.model({
        field8: a.string().required(),
      }),
      Model9: a.model({
        field9: a.string().required(),
      }),
      Model10: a.model({
        field10: a.string().required(),
      }),
    });

    type _ = ClientSchema<typeof s>;
  },
).types([201156, 'instantiations']);
//endregion
