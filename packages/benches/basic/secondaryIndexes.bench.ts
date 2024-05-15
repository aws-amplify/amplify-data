import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('secondary index of model has only ModelFields', () => {
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
}).types([27450, 'instantiations']);

bench(
  'secondary index without using enum field of a model that has enum field',
  () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          description: a.string(),
          status: a.enum(['published', 'reviewing']),
        })
        .secondaryIndexes((index) => [
          index('title').sortKeys(['description']).queryField('myFavIdx'),
          index('description'),
        ]),
    });

    type _ = ClientSchema<typeof s>;
  },
).types([35132, 'instantiations']);

bench(
  'secondary index with using enum field of a model that has enum field',
  () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          description: a.string(),
          status: a.enum(['published', 'reviewing']),
        })
        .secondaryIndexes((index) => [
          index('status').sortKeys(['description']).queryField('myFavIdx'),
          index('description'),
        ]),
    });

    type _ = ClientSchema<typeof s>;
  },
).types([35146, 'instantiations']);

bench(
  'secondary index without using enum field of a model that has enum ref field',
  () => {
    const s = a.schema({
      Status: a.enum(['published', 'reviewing']),
      Post: a
        .model({
          title: a.string().required(),
          description: a.string(),
          status: a.ref('Status'),
        })
        .secondaryIndexes((index) => [
          index('title').sortKeys(['description']).queryField('myFavIdx'),
          index('description'),
        ]),
    });

    type _ = ClientSchema<typeof s>;
  },
).types([33324, 'instantiations']);

bench(
  'secondary index with using enum field of a model that has enum ref field',
  () => {
    const s = a.schema({
      Status: a.enum(['published', 'reviewing']),
      Post: a
        .model({
          title: a.string().required(),
          description: a.string(),
          status: a.ref('Status'),
        })
        .secondaryIndexes((index) => [
          index('status').sortKeys(['description']).queryField('myFavIdx'),
          index('description'),
        ]),
    });

    type _ = ClientSchema<typeof s>;
  },
).types([33380, 'instantiations']);
