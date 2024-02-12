import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

bench('secondary index', () => {
  const s = a.schema({
    Post: a
      .model({
        title: a.string().required(),
        description: a.string(),
        viewCount: a.integer(),
      })
      .secondaryIndexes([
        a.index('title').sortKeys(['viewCount']).queryField('myFavIdx'),
        a.index('description'),
        a.index('viewCount'),
      ]),
  });

  type _ = ClientSchema<typeof s>;
}).types([101228, 'instantiations']);
