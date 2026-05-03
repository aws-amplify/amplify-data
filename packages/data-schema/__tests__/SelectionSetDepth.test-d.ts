import { a, ClientSchema } from '../src/index';
import { Expect, Equal, ExpectFalse } from '@aws-amplify/data-schema-types';

describe('selectionSetDepth ClientSchema option', () => {
  describe('default behavior (no Options), matches pre-#671 main', () => {
    it('default depth (5) exposes 3-hop scalar on flatModel, fixes the back-compat case', () => {
      const schema = a
        .schema({
          Network: a.model({
            name: a.string().required(),
            articles: a.hasMany('Article', 'networkId'),
          }),
          Article: a.model({
            title: a.string().required(),
            networkId: a.id().required(),
            network: a.belongsTo('Network', 'networkId'),
            articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'articleId'),
          }),
          ArticleOriginalWork: a
            .model({
              articleId: a.id().required(),
              personId: a.id().required(),
              article: a.belongsTo('Article', 'articleId'),
              person: a.belongsTo('Person', 'personId'),
            })
            .identifier(['articleId', 'personId']),
          Person: a.model({
            name: a.string().required(),
            articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'personId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      type Schema = ClientSchema<typeof schema>;
      type FlatNetwork = Schema['Network']['__meta']['flatModel'];

      type Article = FlatNetwork['articles'][number];
      type AOW = Article['articleOriginalWorks'][number];
      type Person = AOW['person'];

      // Person must be a structural object, if it collapses to a LazyLoader
      // (function), `Person['name']` would still be `string` via Function.prototype.name
      // and the next assertion would silently pass. This guard catches that.
      type _personIsNotFunction = Expect<
        Equal<Person extends (...args: any) => any ? true : false, false>
      >;
      type _personName = Expect<Equal<Person['name'], string>>;
    });
  });

  describe('depth=0, no flatten escape', () => {
    it('keeps relationships as LazyLoaders; no .* paths into them', () => {
      const schema = a
        .schema({
          Author: a.model({
            name: a.string().required(),
            posts: a.hasMany('Post', 'authorId'),
          }),
          Post: a.model({
            title: a.string().required(),
            authorId: a.id().required(),
            author: a.belongsTo('Author', 'authorId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 0 }>;
      type FlatAuthor = Schema['Author']['__meta']['flatModel'];

      type PostsField = FlatAuthor['posts'];
      type _postsIsCallable = Expect<
        Equal<PostsField extends (...args: any) => any ? true : false, true>
      >;
    });
  });

  describe('depth=1, one hop accessible, second hop stripped', () => {
    it('inlines first related model with scalars only; subsequent rels stripped', () => {
      const schema = a
        .schema({
          Author: a.model({
            name: a.string().required(),
            posts: a.hasMany('Post', 'authorId'),
          }),
          Post: a.model({
            title: a.string().required(),
            authorId: a.id().required(),
            author: a.belongsTo('Author', 'authorId'),
            comments: a.hasMany('Comment', 'postId'),
          }),
          Comment: a.model({
            content: a.string().required(),
            postId: a.id().required(),
            post: a.belongsTo('Post', 'postId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 1 }>;
      type FlatAuthor = Schema['Author']['__meta']['flatModel'];
      type PostInFlat = FlatAuthor['posts'][number];

      type _postTitle = Expect<Equal<PostInFlat['title'], string>>;
      type _postAuthorId = Expect<Equal<PostInFlat['authorId'], string>>;
      // comments is a 2nd-hop relationship, stripped at depth=1
      type _commentsStripped = ExpectFalse<
        Equal<'comments' extends keyof PostInFlat ? true : false, true>
      >;
    });
  });

  describe('depth=2, two hops accessible, third hop stripped', () => {
    it('inlines two relationship layers; third hop is stripped', () => {
      const schema = a
        .schema({
          Author: a.model({
            name: a.string().required(),
            posts: a.hasMany('Post', 'authorId'),
          }),
          Post: a.model({
            title: a.string().required(),
            authorId: a.id().required(),
            author: a.belongsTo('Author', 'authorId'),
            comments: a.hasMany('Comment', 'postId'),
          }),
          Comment: a.model({
            content: a.string().required(),
            postId: a.id().required(),
            post: a.belongsTo('Post', 'postId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 2 }>;
      type FlatAuthor = Schema['Author']['__meta']['flatModel'];
      type PostInFlat = FlatAuthor['posts'][number];
      type CommentInFlat = PostInFlat['comments'][number];

      type _commentContent = Expect<Equal<CommentInFlat['content'], string>>;
      // Comment.post is the 3rd hop, stripped at depth=2
      type _postStrippedOnComment = ExpectFalse<
        Equal<'post' extends keyof CommentInFlat ? true : false, true>
      >;
    });
  });

  describe('depth=3, three hops accessible, Comment.post is now an object', () => {
    it('inlines three relationship layers', () => {
      const schema = a
        .schema({
          Author: a.model({
            name: a.string().required(),
            posts: a.hasMany('Post', 'authorId'),
          }),
          Post: a.model({
            title: a.string().required(),
            authorId: a.id().required(),
            author: a.belongsTo('Author', 'authorId'),
            comments: a.hasMany('Comment', 'postId'),
          }),
          Comment: a.model({
            content: a.string().required(),
            postId: a.id().required(),
            post: a.belongsTo('Post', 'postId'),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 3 }>;
      type FlatAuthor = Schema['Author']['__meta']['flatModel'];
      type PostInFlat = FlatAuthor['posts'][number];
      type CommentInFlat = PostInFlat['comments'][number];
      type PostFieldOnComment = CommentInFlat['post'];

      // At depth=3, Comment.post is a plain object (not a function/LazyLoader)
      type _postOnCommentIsNotFunction = Expect<
        Equal<
          PostFieldOnComment extends (...args: any) => any ? true : false,
          false
        >
      >;
    });
  });

  describe('default depth (5), full 5-hop chain', () => {
    // Linear A → B → C → D → E → F chain. Verifies the default depth actually
    // exposes the full 5 hops, not just 3 like the main back-compat test.
    const linearChainSchema = a
      .schema({
        A: a.model({
          name: a.string().required(),
          bs: a.hasMany('B', 'aId'),
        }),
        B: a.model({
          aId: a.id().required(),
          cs: a.hasMany('C', 'bId'),
        }),
        C: a.model({
          bId: a.id().required(),
          ds: a.hasMany('D', 'cId'),
        }),
        D: a.model({
          cId: a.id().required(),
          es: a.hasMany('E', 'dId'),
        }),
        E: a.model({
          dId: a.id().required(),
          fs: a.hasMany('F', 'eId'),
        }),
        F: a.model({
          eId: a.id().required(),
          leaf: a.string().required(),
        }),
      })
      .authorization((allow) => [allow.publicApiKey()]);

    it('default depth resolves the 5th hop scalar to a structural object', () => {
      type Schema = ClientSchema<typeof linearChainSchema>;
      type FlatA = Schema['A']['__meta']['flatModel'];

      type B = FlatA['bs'][number];
      type C = B['cs'][number];
      type D = C['ds'][number];
      type E = D['es'][number];
      type F = E['fs'][number];

      // 5-hop scalar fully accessible
      type _leafResolves = Expect<Equal<F['leaf'], string>>;

      // 5th-hop model is a structural object, not a LazyLoader, proves the recursion
      // actually traversed all 5 levels (vs collapsing at any earlier boundary).
      type _fIsNotFunction = Expect<
        Equal<F extends (...args: any) => any ? true : false, false>
      >;
    });

    it('depth=4 strips the 5th hop', () => {
      type Schema = ClientSchema<
        typeof linearChainSchema,
        { selectionSetDepth: 4 }
      >;
      type FlatA = Schema['A']['__meta']['flatModel'];

      // 4 hops accessible
      type E = FlatA['bs'][number]['cs'][number]['ds'][number]['es'][number];

      // 5th-hop relationship `fs` is stripped at depth=4
      type _fsStripped = ExpectFalse<
        Equal<'fs' extends keyof E ? true : false, true>
      >;
    });
  });

  describe('range validation', () => {
    it('rejects selectionSetDepth: 6', () => {
      const schema = a
        .schema({
          Post: a.model({ title: a.string().required() }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      // @ts-expect-error - 6 exceeds SelectionSetDepthValue range (0–5)
      type _Schema = ClientSchema<typeof schema, { selectionSetDepth: 6 }>;
    });

    it('rejects selectionSetDepth: -1', () => {
      const schema = a
        .schema({
          Post: a.model({ title: a.string().required() }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      // @ts-expect-error - -1 is not a valid SelectionSetDepthValue
      type _Schema = ClientSchema<typeof schema, { selectionSetDepth: -1 }>;
    });
  });
});
