import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

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
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([86925, 'instantiations']);

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
