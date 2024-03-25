import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('secondary index', () => {
  const s = a.schema({
    Post: a
      .model({
        title: a.string().required(),
        description: a.string(),
        viewCount: a.integer(),
      })
      .secondaryIndexes((index) => [
        index('title').sortKeys(['viewCount']).queryField('myFavIdx'),
        index('description'),
        index('viewCount'),
      ]),
  });

  type _ = ClientSchema<typeof s>;
}).types([64034, 'instantiations']);
