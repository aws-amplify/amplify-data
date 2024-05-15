import { configure } from '@aws-amplify/data-schema/internals';
import type {
  AuthMode,
  CustomHeaders,
  Equal,
  Expect,
  ListReturnValue,
  Prettify,
  SingularReturnValue,
} from '@aws-amplify/data-schema-types';
import { a, type ClientSchema } from '@aws-amplify/data-schema';
import { generateClient } from 'aws-amplify/api';

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
    .authorization((allow) => allow.publicApiKey())
    .setRelationships((models) => [
      models.Post.relationships({
        parentBlog: a.belongsTo('Blog', 'parentBlogId'),
      }),
      models.Blog.relationships({
        childPosts: a.hasMany('Post', 'parentBlogId'),
      }),
    ]);

  type Schema = ClientSchema<typeof schema>;
  const client = generateClient<Schema>();

  describe('model operations', () => {
    it('generates correct return type for list operation', async () => {
      const { data } = await client.models.Post.list();

      type DataType = (typeof data)[number];

      type Expected = {
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
        parentBlogId?: string | null | undefined;
      };

      type Resolved = DataType extends Expected ? true : false;

      type _ = Expect<Equal<Resolved, true>>;
    });

    it('generates correct return type for create operation', async () => {
      const { data } = await client.models.Post.create({
        title: 'test',
      });

      type DataType = Prettify<typeof data>;

      type Expected = {
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
        parentBlogId?: string | null | undefined;
      } | null;

      type Resolved = DataType extends Expected ? true : false;

      type _ = Expect<Equal<Resolved, true>>;
    });

    it('generates correct return type for create update', async () => {
      const { data } = await client.models.Post.update({
        id: 'id',
        title: 'test',
      });

      type DataType = Prettify<typeof data>;

      type Expected = {
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
        parentBlogId?: string | null | undefined;
      } | null;

      type Resolved = DataType extends Expected ? true : false;

      type _ = Expect<Equal<Resolved, true>>;
    });
  });
});
