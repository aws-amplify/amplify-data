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
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([86925, 'instantiations']);
