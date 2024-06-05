import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('basic schema', () => {
  a.schema({
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([2405, 'instantiations']);

bench('basic schema w client types', () => {
  const s = a.schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([4622, 'instantiations']);
