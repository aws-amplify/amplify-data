import { a } from '../index';

test('secondaryIndexes input validation', () => {
  a.schema({
    Post: a
      .model({
        title: a.string().required(),
        postNumber: a.integer().required(),
        description: a.string(),
        metadata: a.json(),
        viewCount: a.integer(),
        tags: a.string().array(),
        comments: a.hasMany('Comment'),
        location: a.customType({ lat: a.float(), long: a.float() }),
        status: a.ref('Status'),
      })
      .secondaryIndexes([
        // VALID cases
        // required string
        a.index('title'),
        // required number
        a.index('postNumber'),
        // nullable string
        a.index('description'),
        // nullable number
        a.index('viewCount'),
        a.index('title').sortKeys(['description', 'viewCount', 'postNumber']),

        // ERROR cases
        // @ts-expect-error - nonexistent
        a.index('nonexistent-field'),
        // @ts-expect-error - only string | number type fields are allowed
        a.index('metadata'),
        // @ts-expect-error - array field
        a.index('tags'),
        // @ts-expect-error - relational field
        a.index('comments'),
        // @ts-expect-error - custom type field
        a.index('location'),
        // @ts-expect-error - ref type field
        a.index('status'),
        // @ts-expect-error - nonexistent
        a.index('title').sortKeys(['nonexistent-field']),
        // @ts-expect-error
        a.index('title').sortKeys(['metadata']),
        // @ts-expect-error
        a.index('title').sortKeys(['tags']),
        // @ts-expect-error
        a.index('title').sortKeys(['comments']),
        // @ts-expect-error
        a.index('title').sortKeys(['location']),
        // @ts-expect-error
        a.index('title').sortKeys(['status']),
        // @ts-expect-error - SK can't use PK field
        a.index('title').sortKeys(['title']),
      ]),
    Comment: a.model({
      content: a.string(),
    }),
    Status: a.enum(['DRAFT', 'PENDING', 'PUBLISHED']),
  });
});
