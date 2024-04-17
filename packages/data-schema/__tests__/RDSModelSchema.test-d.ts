import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import {
  AuthMode,
  CustomHeaders,
  ListReturnValue,
  SingularReturnValue,
} from '../src/runtime';
import { type ClientSchema, a } from '../src/index';
import { configure } from '../src/ModelSchema';

describe('RDSModelSchema', () => {
  const schema = configure({
    database: {
      engine: 'mysql',
      connectionUri: 'fake' as any,
    },
  })
    .schema({
      Post: a.model({
        title: a.string().required(),
        content: a.string(),
        parentBlogId: a.string(),
      }),
      Blog: a.model({
        title: a.string().required(),
        description: a.string(),
      }),
    })
    .authorization([a.allow.public()])
    .relationships((models) => [
      models.Post.addRelationships({
        parentBlog: a.belongsTo('Blog', 'parentBlogId'),
      }),
      models.Blog.addRelationships({
        childPosts: a.hasMany('Post', 'parentBlogId'),
      }),
    ]);

  type Schema = ClientSchema<typeof schema>;

  describe('.relationships() modifier', () => {
    it('inserts model relation fields into target models', () => {
      type ResolvedPost = Prettify<Schema['Post']>;
      type ResolvedBlog = Prettify<Schema['Blog']>;

      type ExpectedPostShape = {
        title: string;
        parentBlog: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<any>;
        content?: string | null | undefined;
      };
      type ExpectedBlogShape = {
        title: string;
        childPosts: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                limit?: number | undefined;
                nextToken?: string | null | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => ListReturnValue<any>;
        description?: string | null | undefined;
      };

      type ValidPost = ResolvedPost extends ExpectedPostShape ? true : false;
      type ValidBlog = ResolvedBlog extends ExpectedBlogShape ? true : false;

      type _PostValidation = Expect<Equal<ValidPost, true>>;
      type _BlogValidation = Expect<Equal<ValidBlog, true>>;
    });
  });
});
