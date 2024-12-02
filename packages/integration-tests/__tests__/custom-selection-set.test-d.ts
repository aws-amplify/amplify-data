import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { generateClient, SelectionSet } from 'aws-amplify/api';

type Json = null | string | number | boolean | object | any[];

describe('Custom Selection Set', () => {
  describe('Basic, single model', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('can specify custom selection set for all fields', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly title: string;
        readonly description: string | null;
        readonly createdAt: string;
        readonly updatedAt: string;
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('can specify custom selection set for a subset of fields', async () => {
      const client = generateClient<Schema>();
      const posts = await client.models.Post.list({
        selectionSet: ['id', 'title'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly title: string;
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('can specify custom selection set through variable', async () => {
      const client = generateClient<Schema>();

      const selSet = ['id', 'title'] as const;

      const posts = await client.models.Post.list({
        selectionSet: selSet,
      });

      type ExpectedType = {
        readonly id: string;
        readonly title: string;
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;

      type WithUtil = SelectionSet<Schema['Post']['type'], typeof selSet>[];

      type test2 = Expect<Equal<WithUtil, ExpectedType>>;
    });

    test('SelectionSet util return type matches actual', async () => {
      const client = generateClient<Schema>();
      const posts = await client.models.Post.list({
        selectionSet: ['id', 'title'],
      });

      type Post = Schema['Post']['type'];

      type ExpectedType = SelectionSet<Post, ['id', 'title']>[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('error when specifying a non-existent field', () => {
      const client = generateClient<Schema>();
      client.models.Post.list({
        // @ts-expect-error
        selectionSet: ['id', 'does-not-exist'],
      });
    });
  });

  describe('Model with hasOne relationship', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        author: a.hasOne('Author', 'postId'),
      }),
      Author: a.model({
        name: a.string().required(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('can specify custom selection set for all fields on related model explicitly', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'author.id',
          'author.name',
          'author.createdAt',
          'author.updatedAt',
        ],
      });

      type ExpectedType = {
        readonly id: string;
        readonly author: {
          readonly name: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
        };
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('can specify custom selection set for all fields on related model with wildcard `.*`', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'title',
          'description',
          'createdAt',
          'updatedAt',
          'author.*',
        ],
      });

      type ExpectedType = {
        readonly id: string;
        readonly title: string;
        readonly description: string | null;
        readonly createdAt: string;
        readonly updatedAt: string;
        readonly author: {
          readonly name: string;
          readonly id: string;
          readonly postId: string | null;
          readonly createdAt: string;
          readonly updatedAt: string;
        };
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('SelectionSet util return type matches actual', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'title',
          'description',
          'createdAt',
          'updatedAt',
          'author.*',
        ],
      });

      type Post = Schema['Post']['type'];

      type ExpectedType = SelectionSet<
        Post,
        ['id', 'title', 'description', 'createdAt', 'updatedAt', 'author.*']
      >[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });
  });

  describe('Model with bi-directional hasMany relationship', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string().required(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('specifying wildcard selection set on relationship returns only non-relationship fields', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: ['id', 'comments.*'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly comments: {
          readonly content: string;
          readonly id: string;
          readonly postId: string | null;
          readonly createdAt: string;
          readonly updatedAt: string;
          // post is omitted;
        }[];
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });

    test('custom selection set path can go up to 6 levels deep', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'comments.post.comments.post.comments.post.comments.*',
        ],
      });

      type ExpectedType2 = {
        readonly id: string;
        readonly comments: {
          readonly post: {
            readonly comments: {
              readonly post: {
                readonly comments: {
                  readonly post: {
                    readonly comments: {
                      readonly content: string;
                      readonly id: string;
                      readonly postId: string | null;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                    }[];
                  };
                }[];
              };
            }[];
          };
        }[];
      }[];

      type test = Expect<Equal<typeof posts.data, ExpectedType2>>;
    });

    test('SelectionSet util return type matches actual', async () => {
      const client = generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'comments.post.comments.post.comments.post.comments.*',
        ],
      });

      type ExpectedType = SelectionSet<
        Schema['Post']['type'],
        ['id', 'comments.post.comments.post.comments.post.*']
      >[];

      type test = Expect<Equal<typeof posts.data, ExpectedType>>;
    });
  });

  describe('Complex relationship', () => {
    const schema = a.schema({
      Blog: a.model({
        posts: a.hasMany('Post', 'blogId'),
      }),
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        meta: a.string().array(),
        blogId: a.id(),
        blog: a.belongsTo('Blog', 'blogId'),
        comments: a.hasMany('Comment', 'postId'),
        comments2: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string().required(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
        meta: a.hasMany('CommentMeta', 'commentId'),
      }),
      CommentMeta: a.model({
        metaData: a.json(),
        commentId: a.id(),
        comment: a.belongsTo('Comment', 'commentId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('a mix of everything', async () => {
      const client = generateClient<Schema>();

      const blogs = await client.models.Blog.list({
        selectionSet: [
          'id',
          'updatedAt',
          'posts.id',
          'posts.updatedAt',
          'posts.meta',
          'posts.comments.content',
          'posts.comments.createdAt',
          'posts.comments2.content',
          'posts.comments.meta.*',
          'posts.comments2.meta.*',
        ],
      });

      type ExpectedType = {
        readonly id: string;
        readonly updatedAt: string;
        readonly posts: {
          readonly id: string;
          readonly meta: (string | null)[] | null;
          readonly updatedAt: string;
          readonly comments: {
            readonly createdAt: string;
            readonly content: string;
            readonly meta: {
              readonly id: string;
              readonly commentId: string | null;
              readonly createdAt: string;
              readonly updatedAt: string;
              readonly metaData: Json;
            }[];
          }[];
          readonly comments2: {
            readonly content: string;
            readonly meta: {
              readonly id: string;
              readonly commentId: string | null;
              readonly createdAt: string;
              readonly updatedAt: string;
              readonly metaData: Json;
            }[];
          }[];
        }[];
      }[];

      type test = Expect<Equal<typeof blogs.data, ExpectedType>>;
    });

    test('a mix of everything', async () => {
      const client = generateClient<Schema>();

      const blogs = await client.models.Blog.list({
        selectionSet: [
          'id',
          'updatedAt',
          'posts.id',
          'posts.updatedAt',
          'posts.meta',
          'posts.comments.content',
          'posts.comments.createdAt',
          'posts.comments2.content',
          'posts.comments.meta.*',
          'posts.comments2.meta.*',
        ],
      });

      type ExpectedType = SelectionSet<
        Schema['Blog']['type'],
        [
          'id',
          'updatedAt',
          'posts.id',
          'posts.updatedAt',
          'posts.meta',
          'posts.comments.content',
          'posts.comments.createdAt',
          'posts.comments2.content',
          'posts.comments.meta.*',
          'posts.comments2.meta.*',
        ]
      >[];

      type test = Expect<Equal<typeof blogs.data, ExpectedType>>;
    });
  });

  describe('Custom Types', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        location: a.ref('Location').required(),
      }),

      Post2: a.model({
        title: a.string().required(),
        description: a.string(),
        location: a.ref('Location'),
      }),

      Post3: a.model({
        title: a.string().required(),
        description: a.string(),
        altLocation: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),

      Post4: a.model({
        title: a.string().required(),
        description: a.string(),
        meta: a.customType({
          status: a.enum(['published', 'unpublished']),
          tags: a.string().array().required(),
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
        }),
      }),

      Post5: a.model({
        title: a.string().required(),
        description: a.string(),
        meta: a.customType({
          status: a.enum(['published', 'unpublished']),
          tags: a.string().array().required(),
          location: a.ref('Location').required(),
        }),
      }),

      Post6: a.model({
        title: a.string().required(),
        description: a.string(),
        meta: a.ref('Meta').required(),
      }),

      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),

      Meta: a.customType({
        tags: a.string().array(),
        requiredTags: a.string().required().array().required(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('custom selection set on required custom type', async () => {
      const { data: posts } = await client.models.Post.list({
        selectionSet: ['title', 'location.lat'],
      });

      type ExpectedType = {
        readonly title: string;
        readonly location: {
          readonly lat: number | null;
        };
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('custom selection set on nullable custom type', async () => {
      const { data: posts } = await client.models.Post2.list({
        selectionSet: ['title', 'location.lat'],
      });

      type ExpectedType = {
        readonly title: string;
        readonly location: {
          readonly lat: number | null;
        } | null;
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('custom selection set on implicit nullable custom type', async () => {
      const { data: posts } = await client.models.Post3.list({
        selectionSet: ['title', 'altLocation.lat'],
      });

      type ExpectedType = {
        readonly title: string;
        readonly altLocation: {
          readonly lat: number | null;
        } | null;
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('custom selection set on nested nullable custom type', async () => {
      const { data: posts } = await client.models.Post4.list({
        selectionSet: ['title', 'meta.tags', 'meta.location.lat'],
      });

      type ExpectedType = {
        readonly title: string;
        readonly meta: {
          readonly tags: (string | null)[];
          readonly location: {
            readonly lat: number | null;
          } | null;
        } | null;
      }[];

      type _ = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('custom selection set on nested non-nullable custom type', async () => {
      const { data: posts } = await client.models.Post5.list({
        selectionSet: ['title', 'meta.tags', 'meta.location.lat'],
      });

      type ExpectedType = {
        readonly title: string;
        readonly meta: {
          readonly tags: (string | null)[];
          readonly location: {
            readonly lat: number | null;
          };
        } | null;
      }[];

      type _ = Expect<Equal<typeof posts, ExpectedType>>;
    });

    // https://github.com/aws-amplify/amplify-category-api/issues/2368 - number 4.
    test('custom selection set on explicit non-nullable custom type with array fields', async () => {
      const selSet = ['title', 'meta.tags', 'meta.requiredTags'] as const;

      const { data: posts } = await client.models.Post6.list({
        selectionSet: selSet,
      });

      type ActualType = typeof posts;

      type ExpectedType = {
        readonly title: string;
        readonly meta: {
          readonly tags: (string | null)[] | null;
          readonly requiredTags: string[];
        };
      }[];

      type _ = Expect<Equal<ActualType, ExpectedType>>;
    });
  });

  describe('Enums', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        status: a.ref('Status'),
        visibility: a.enum(['PRIVATE', 'PUBLIC']),
      }),

      Status: a.enum(['DRAFT', 'PENDING', 'PUBLISHED']),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('custom selection set on shorthand enum field', async () => {
      const { data: post } = await client.models.Post.get(
        { id: 'abc' },
        {
          selectionSet: ['title', 'visibility'],
        },
      );

      type ExpectedType = {
        readonly title: string;
        readonly visibility: 'PRIVATE' | 'PUBLIC' | null;
      } | null;

      type test = Expect<Equal<typeof post, ExpectedType>>;
    });

    test('custom selection set on enum ref', async () => {
      const { data: post } = await client.models.Post.get(
        { id: 'abc' },
        {
          selectionSet: ['title', 'status'],
        },
      );

      type ExpectedType = {
        readonly title: string;
        readonly status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | null;
      } | null;

      type test = Expect<Equal<typeof post, ExpectedType>>;
    });
  });
});

// Comments
