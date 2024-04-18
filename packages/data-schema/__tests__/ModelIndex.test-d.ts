import { a } from '../src/index';

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
        comments: a.hasMany('Comment', 'postId'),
        location: a.customType({ lat: a.float(), long: a.float() }),
        status: a.ref('Status'),
        fieldWithAuth: a
          .string()
          .required()
          .authorization((allow) => allow.owner().to(['read'])),
      })
      .secondaryIndexes((index) => [
        // VALID cases
        // required string
        index('title'),
        // required number
        index('postNumber'),
        // nullable string
        index('description'),
        // nullable number
        index('viewCount'),
        index('title').sortKeys(['description', 'viewCount', 'postNumber']),
        // field with field level auth can be used as the partition key
        index('fieldWithAuth'),
        // field with field level auth can be used as a sort key
        index('title').sortKeys(['fieldWithAuth']),

        // ERROR cases
        // @ts-expect-error - nonexistent
        index('nonexistent-field'),
        // @ts-expect-error - only string | number type fields are allowed
        index('metadata'),
        // @ts-expect-error - array field
        index('tags'),
        // @ts-expect-error - relational field
        index('comments'),
        // @ts-expect-error - custom type field
        index('location'),
        // @ts-expect-error - ref type field
        index('status'),
        // @ts-expect-error - nonexistent
        index('title').sortKeys(['nonexistent-field']),
        // @ts-expect-error
        index('title').sortKeys(['metadata']),
        // @ts-expect-error
        index('title').sortKeys(['tags']),
        // @ts-expect-error
        index('title').sortKeys(['comments']),
        // @ts-expect-error
        index('title').sortKeys(['location']),
        // @ts-expect-error
        index('title').sortKeys(['status']),
        // @ts-expect-error - SK can't use PK field
        index('title').sortKeys(['title']),
      ]),
    Comment: a.model({
      content: a.string(),
      postId: a.id(),
      post: a.belongsTo('Post', 'postId'),
    }),
    Status: a.enum(['DRAFT', 'PENDING', 'PUBLISHED']),
  });
});
