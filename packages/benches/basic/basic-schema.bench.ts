import { bench } from '@arktype/attest';
import { a, type ClientSchema } from '@aws-amplify/data-schema';

bench('basic schema', () => {
  a.schema({
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([2434, 'instantiations']);

bench('basic schema w client types', () => {
  const s = a.schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([5106, 'instantiations']);
