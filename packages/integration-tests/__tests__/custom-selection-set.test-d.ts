import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';
import { Expect, Equal } from '@aws-amplify/amplify-api-next-types-alpha';
import { API } from 'aws-amplify';

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
      const client = API.generateClient<Schema>();

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

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('can specify custom selection set for a subset of fields', async () => {
      const client = API.generateClient<Schema>();
      const posts = await client.models.Post.list({
        selectionSet: ['id', 'title'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly title: string;
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('error when specifying a non-existent field', () => {
      const client = API.generateClient<Schema>();
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
        author: a.hasOne('Author'),
      }),
      Author: a.model({
        name: a.string().required(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('can specify custom selection set for all fields on related model explicitly', async () => {
      const client = API.generateClient<Schema>();

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

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('can specify custom selection set for all fields on related model with wildcard `.*`', async () => {
      const client = API.generateClient<Schema>();

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
          readonly createdAt: string;
          readonly updatedAt: string;
        };
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });
  });

  describe('Model with bi-directional hasMany relationship', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string().required(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('specifying wildcard selection set on relationship returns only non-relational fields', async () => {
      const client = API.generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: ['id', 'comments.*'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly comments: {
          readonly content: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          // post is omitted;
        }[];
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('custom selection set path can go up to 6 levels deep', async () => {
      const client = API.generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: [
          'id',
          'comments.post.comments.post.comments.post.comments.*',
        ],
      });

      type ExpectedType = {
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

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });
  });

  describe('Many to many relationship', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        postTags: a.manyToMany('Tag', { connectionName: 'PostTags' }),
      }),
      Tag: a.model({
        label: a.string().required(),
        post: a.manyToMany('Post', { connectionName: 'PostTags' }),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('wildcard on the target model', async () => {
      const client = API.generateClient<Schema>();

      const posts = await client.models.Post.list({
        selectionSet: ['id', 'postTags.tag.*'],
      });

      type ExpectedType = {
        readonly id: string;
        readonly postTags: {
          readonly tag: {
            readonly id: string;
            readonly label: string;
            readonly createdAt: string;
            readonly updatedAt: string;
          };
        }[];
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });
  });

  describe('Complex relationship', () => {
    const schema = a.schema({
      Blog: a.model({
        posts: a.hasMany('Post'),
      }),
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        meta: a.string().array(),
        comments: a.hasMany('Comment'),
        comments2: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string().required(),
        post: a.belongsTo('Post'),
        meta: a.hasMany('CommentMeta'),
      }),
      CommentMeta: a.model({
        metaData: a.json(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('a mix of everything', async () => {
      const client = API.generateClient<Schema>();

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
              readonly createdAt: string;
              readonly updatedAt: string;
              readonly metaData: any;
            }[];
          }[];
          readonly comments2: {
            readonly content: string;
            readonly meta: {
              readonly id: string;
              readonly createdAt: string;
              readonly updatedAt: string;
              readonly metaData: any;
            }[];
          }[];
        }[];
      }[];

      type test = Expect<Equal<typeof blogs, ExpectedType>>;
    });
  });
});
