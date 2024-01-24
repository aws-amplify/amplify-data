import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

//region basic schemas
bench('basic schema', () => {
  a.schema({
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([3045, 'instantiations']);

bench('basic schema w client types', () => {
  const s = a.schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([86925, 'instantiations']);
//end region

/**
 * The following benchmarks are for testing ~p50 schemas.
 * A p50 of 3 models, 5 fields, all connected with relationships, and 2 auth rules
 * and at least 1 field-level auth rule
 */
//region p50 schemas
//region basic schemas
bench('p50', () => {
  a.schema({
    // Because no model-level authorization rule is present
    // this model will use the global authorization rule.
    Todo: a.model({
      id: a.id().required(),
      name: a.string().default('My new Todo'),
      privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
      viewCount: a.integer(),
      complete: a.boolean(),
    }),
    Post: a
      .model({
        name: a.string().required(),
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
}).types();

// bench('p50 w/ client types', () => {
//   const s = a.schema({
//     Post: a.model({
//       title: a.string().required(),
//       description: a.string(),
//       viewCount: a.integer(),
//     }),
//   });

//   type _ = ClientSchema<typeof s>;
// }).types();
//endregion

/**
 * The following benchmarks are for testing ~p90 schemas. TODO: add more
 */
//region upper-bound
bench(
  'upper-bound schema w/ client types - X models with Y fields each',
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
