import { a, ClientSchema } from '@aws-amplify/data-schema';
import { generateClient } from 'aws-amplify/api';

describe('secondary indexes / index queries', () => {
  const schema = a.schema({
    Post: a
      .model({
        title: a.string().required(),
        viewCount: a.integer(),
        updatedAt: a.string(),
      })
      .secondaryIndexes([
        a.index('title'),
        a
          .index('viewCount')
          .queryField('myCustomIdx')
          .sortKeys(['updatedAt', 'title']),
      ]),
  });

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  test('PK only', async () => {
    const { data: posts } = await client.models.Post.listByTitle(
      {
        title: 'abc',
      },
      { selectionSet: ['id', 'updatedAt'] },
    );

    type Posts1 = typeof posts;
    //   ^?
  });

  test('With SK', async () => {
    const { data: posts2 } = await client.models.Post.myCustomIdx(
      {
        viewCount: 5,
        updatedAt: { gt: '3' },
        title: { beginsWith: 'Hello' },
      },
      { selectionSet: ['id'] },
    );

    type Posts2 = typeof posts2;
    //   ^?
  });
});
