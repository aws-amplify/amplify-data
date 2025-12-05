/**
 * Property-based type tests for FlatModel generation and bi-directional relationship short-circuiting.
 *
 * These tests verify that the FlatModel type infrastructure correctly:
 * 1. Short-circuits bi-directional relationships to prevent cyclical paths
 * 2. Preserves non-cyclical relationship paths
 * 3. Handles self-referential relationships correctly
 */
import type {
  Equal,
  Expect,
  ExpectFalse,
  HasKey,
} from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../src/index';
import type {
  FlatResolveFields,
  ShortCircuitBiDirectionalRelationship,
} from '../src/ClientSchema/utilities';
import type { ModelRelationshipField } from '../src/ModelRelationshipField';

/**
 * **Feature: selection-set-optimization, Property 1: Bi-directional relationship short-circuiting**
 * **Validates: Requirements 1.1**
 *
 * For any schema with a bi-directional relationship (parent with hasMany/hasOne to child,
 * child with belongsTo to parent), the generated FlatModel for the parent SHALL NOT include
 * the belongsTo field on the child model that references back to the parent.
 */
describe('Property 1: Bi-directional relationship short-circuiting', () => {
  describe('hasMany/belongsTo bi-directional relationship', () => {
    // Schema with Post (hasMany) -> Comment (belongsTo) -> Post
    const schema = a.schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('ShortCircuitBiDirectionalRelationship omits belongsTo field referencing parent', () => {
      // Define raw fields that simulate Comment's field metadata
      type CommentRawFields = {
        content: any;
        postId: any;
        post: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'belongsTo';
            relatedModel: 'Post';
            array: false;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Post',
          never,
          undefined
        >;
      };

      // Resolved Comment model fields (before short-circuiting)
      type CommentFields = {
        content: string | null;
        postId: string | null;
        post: any; // This would be the resolved relationship
      };

      // Apply short-circuit with 'Post' as parent
      type ShortCircuitedComment = ShortCircuitBiDirectionalRelationship<
        CommentFields,
        'Post',
        CommentRawFields
      >;

      // The 'post' field should be omitted because it's a belongsTo referencing 'Post'
      type HasPostField = 'post' extends keyof ShortCircuitedComment
        ? true
        : false;
      type test1 = Expect<Equal<HasPostField, false>>;

      // Other fields should be preserved
      type HasContentField = 'content' extends keyof ShortCircuitedComment
        ? true
        : false;
      type test2 = Expect<Equal<HasContentField, true>>;

      type HasPostIdField = 'postId' extends keyof ShortCircuitedComment
        ? true
        : false;
      type test3 = Expect<Equal<HasPostIdField, true>>;
    });

    test('ShortCircuitBiDirectionalRelationship preserves fields when no parent match', () => {
      // Define raw fields that simulate Comment's field metadata
      type CommentRawFields = {
        content: any;
        postId: any;
        post: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'belongsTo';
            relatedModel: 'Post';
            array: false;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Post',
          never,
          undefined
        >;
      };

      type CommentFields = {
        content: string | null;
        postId: string | null;
        post: any;
      };

      // Apply short-circuit with 'Author' as parent (not 'Post')
      // The 'post' field should NOT be omitted because it references 'Post', not 'Author'
      type ShortCircuitedComment = ShortCircuitBiDirectionalRelationship<
        CommentFields,
        'Author',
        CommentRawFields
      >;

      type HasPostField = 'post' extends keyof ShortCircuitedComment
        ? true
        : false;
      type test = Expect<Equal<HasPostField, true>>;
    });
  });

  describe('hasOne/belongsTo bi-directional relationship', () => {
    test('ShortCircuitBiDirectionalRelationship omits belongsTo in hasOne relationship', () => {
      // Schema: Customer (hasOne) -> Cart (belongsTo) -> Customer
      type CartRawFields = {
        items: any;
        customerId: any;
        customer: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'belongsTo';
            relatedModel: 'Customer';
            array: false;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Customer',
          never,
          undefined
        >;
      };

      type CartFields = {
        items: string[] | null;
        customerId: string | null;
        customer: any;
      };

      type ShortCircuitedCart = ShortCircuitBiDirectionalRelationship<
        CartFields,
        'Customer',
        CartRawFields
      >;

      // The 'customer' field should be omitted
      type HasCustomerField = 'customer' extends keyof ShortCircuitedCart
        ? true
        : false;
      type test = Expect<Equal<HasCustomerField, false>>;
    });
  });

  describe('non-belongsTo relationships are preserved', () => {
    test('hasMany relationships are not short-circuited', () => {
      type ParentRawFields = {
        name: any;
        children: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'hasMany';
            relatedModel: 'Child';
            array: true;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Child',
          never,
          undefined
        >;
      };

      type ParentFields = {
        name: string | null;
        children: any[];
      };

      type ShortCircuitedParent = ShortCircuitBiDirectionalRelationship<
        ParentFields,
        'Child',
        ParentRawFields
      >;

      // hasMany should NOT be short-circuited even if it references the "parent"
      type HasChildrenField = 'children' extends keyof ShortCircuitedParent
        ? true
        : false;
      type test = Expect<Equal<HasChildrenField, true>>;
    });

    test('hasOne relationships are not short-circuited', () => {
      type ParentRawFields = {
        name: any;
        profile: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'hasOne';
            relatedModel: 'Profile';
            array: false;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Profile',
          never,
          undefined
        >;
      };

      type ParentFields = {
        name: string | null;
        profile: any;
      };

      type ShortCircuitedParent = ShortCircuitBiDirectionalRelationship<
        ParentFields,
        'Profile',
        ParentRawFields
      >;

      // hasOne should NOT be short-circuited
      type HasProfileField = 'profile' extends keyof ShortCircuitedParent
        ? true
        : false;
      type test = Expect<Equal<HasProfileField, true>>;
    });
  });

  describe('no parent model name (never) preserves all fields', () => {
    test('when ParentModelName is never, all fields are preserved', () => {
      type CommentRawFields = {
        content: any;
        post: ModelRelationshipField<
          {
            type: 'model';
            relationshipType: 'belongsTo';
            relatedModel: 'Post';
            array: false;
            valueRequired: false;
            references: string[];
            arrayRequired: false;
          },
          'Post',
          never,
          undefined
        >;
      };

      type CommentFields = {
        content: string | null;
        post: any;
      };

      // When ParentModelName is never, no short-circuiting should occur
      type ShortCircuitedComment = ShortCircuitBiDirectionalRelationship<
        CommentFields,
        never,
        CommentRawFields
      >;

      type HasPostField = 'post' extends keyof ShortCircuitedComment
        ? true
        : false;
      type test = Expect<Equal<HasPostField, true>>;
    });
  });
});

/**
 * **Feature: selection-set-optimization, Property 2: Non-cyclical path preservation**
 * **Validates: Requirements 2.1, 2.2, 2.3**
 *
 * For any schema with relationships, and for any non-cyclical path through those
 * relationships up to 6 levels deep, the generated FlatModel type SHALL include
 * that path as a valid selection set option.
 */
describe('Property 2: Non-cyclical path preservation', () => {
  describe('non-cyclical paths through different models are preserved', () => {
    // Schema: Author -> Post -> Comment (no cycles back to Author)
    const schema = a.schema({
      Author: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'authorId'),
      }),
      Post: a.model({
        title: a.string(),
        authorId: a.id(),
        author: a.belongsTo('Author', 'authorId'),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('FlatModel preserves hasMany relationship paths', () => {
      // Author's flatModel should include 'posts' field
      type AuthorFlatModel = Schema['Author']['__meta']['flatModel'];
      type HasPostsField = 'posts' extends keyof AuthorFlatModel ? true : false;
      type test = Expect<Equal<HasPostsField, true>>;
    });

    test('FlatModel preserves nested non-cyclical paths (Author -> Post -> Comment)', () => {
      // Author's flatModel should have posts, and posts should have comments
      type AuthorFlatModel = Schema['Author']['__meta']['flatModel'];
      type PostsType = AuthorFlatModel['posts'];

      // Posts should be an array
      type PostsIsArray = PostsType extends Array<infer _> ? true : false;
      type test1 = Expect<Equal<PostsIsArray, true>>;

      // Each post should have comments field (non-cyclical path)
      type PostElement = PostsType extends Array<infer P> ? P : never;
      type HasCommentsField = 'comments' extends keyof PostElement
        ? true
        : false;
      type test2 = Expect<Equal<HasCommentsField, true>>;
    });

    test('FlatModel omits cyclical belongsTo but preserves non-cyclical belongsTo', () => {
      // Post's flatModel should NOT have 'author' (cyclical back to parent when accessed from Author)
      // But when accessed directly, Post should have author
      type PostFlatModel = Schema['Post']['__meta']['flatModel'];

      // Post's direct flatModel should have author (it's not cyclical from Post's perspective)
      type HasAuthorField = 'author' extends keyof PostFlatModel ? true : false;
      type test1 = Expect<Equal<HasAuthorField, true>>;

      // But when accessed through Author -> Post, the author field should be omitted
      type AuthorFlatModel = Schema['Author']['__meta']['flatModel'];
      type PostFromAuthor =
        AuthorFlatModel['posts'] extends Array<infer P> ? P : never;
      type PostFromAuthorHasAuthor = 'author' extends keyof PostFromAuthor
        ? true
        : false;
      type test2 = Expect<Equal<PostFromAuthorHasAuthor, false>>;
    });
  });

  describe('multiple relationships to different models are preserved', () => {
    // Schema: User has posts and comments (different relationships)
    const schema = a.schema({
      User: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'userId'),
        comments: a.hasMany('Comment', 'userId'),
      }),
      Post: a.model({
        title: a.string(),
        userId: a.id(),
        user: a.belongsTo('User', 'userId'),
      }),
      Comment: a.model({
        content: a.string(),
        userId: a.id(),
        user: a.belongsTo('User', 'userId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('FlatModel preserves all hasMany relationships to different models', () => {
      type UserFlatModel = Schema['User']['__meta']['flatModel'];

      // User should have both posts and comments
      type HasPostsField = 'posts' extends keyof UserFlatModel ? true : false;
      type HasCommentsField = 'comments' extends keyof UserFlatModel
        ? true
        : false;

      type test1 = Expect<Equal<HasPostsField, true>>;
      type test2 = Expect<Equal<HasCommentsField, true>>;
    });

    test('each relationship path is independently traversable', () => {
      type UserFlatModel = Schema['User']['__meta']['flatModel'];

      // Posts should have their own fields
      type PostElement =
        UserFlatModel['posts'] extends Array<infer P> ? P : never;
      type PostHasTitle = 'title' extends keyof PostElement ? true : false;
      type test1 = Expect<Equal<PostHasTitle, true>>;

      // Comments should have their own fields
      type CommentElement =
        UserFlatModel['comments'] extends Array<infer C> ? C : never;
      type CommentHasContent = 'content' extends keyof CommentElement
        ? true
        : false;
      type test2 = Expect<Equal<CommentHasContent, true>>;
    });
  });

  describe('traversal through child to different parent is preserved', () => {
    // Schema: Author -> Post -> Category (Post belongs to both Author and Category)
    const schema = a.schema({
      Author: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'authorId'),
      }),
      Category: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'categoryId'),
      }),
      Post: a.model({
        title: a.string(),
        authorId: a.id(),
        categoryId: a.id(),
        author: a.belongsTo('Author', 'authorId'),
        category: a.belongsTo('Category', 'categoryId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('traversal from Author -> Post -> Category is preserved', () => {
      type AuthorFlatModel = Schema['Author']['__meta']['flatModel'];
      type PostFromAuthor =
        AuthorFlatModel['posts'] extends Array<infer P> ? P : never;

      // Post accessed from Author should have category (non-cyclical path to different model)
      type HasCategoryField = 'category' extends keyof PostFromAuthor
        ? true
        : false;
      type test = Expect<Equal<HasCategoryField, true>>;
    });

    test('traversal from Category -> Post -> Author is preserved', () => {
      type CategoryFlatModel = Schema['Category']['__meta']['flatModel'];
      type PostFromCategory =
        CategoryFlatModel['posts'] extends Array<infer P> ? P : never;

      // Post accessed from Category should have author (non-cyclical path to different model)
      type HasAuthorField = 'author' extends keyof PostFromCategory
        ? true
        : false;
      type test = Expect<Equal<HasAuthorField, true>>;
    });

    test('cyclical paths back to same parent are still omitted', () => {
      type AuthorFlatModel = Schema['Author']['__meta']['flatModel'];
      type PostFromAuthor =
        AuthorFlatModel['posts'] extends Array<infer P> ? P : never;

      // Post accessed from Author should NOT have author (cyclical back to Author)
      type HasAuthorField = 'author' extends keyof PostFromAuthor
        ? true
        : false;
      type test = Expect<Equal<HasAuthorField, false>>;
    });
  });

  describe('scalar and non-relationship fields are always preserved', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        content: a.string(),
        viewCount: a.integer(),
        isPublished: a.boolean(),
        tags: a.string().array(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('all scalar fields are preserved in FlatModel', () => {
      type PostFlatModel = Schema['Post']['__meta']['flatModel'];

      type HasTitle = 'title' extends keyof PostFlatModel ? true : false;
      type HasContent = 'content' extends keyof PostFlatModel ? true : false;
      type HasViewCount = 'viewCount' extends keyof PostFlatModel
        ? true
        : false;
      type HasIsPublished = 'isPublished' extends keyof PostFlatModel
        ? true
        : false;
      type HasTags = 'tags' extends keyof PostFlatModel ? true : false;

      type test1 = Expect<Equal<HasTitle, true>>;
      type test2 = Expect<Equal<HasContent, true>>;
      type test3 = Expect<Equal<HasViewCount, true>>;
      type test4 = Expect<Equal<HasIsPublished, true>>;
      type test5 = Expect<Equal<HasTags, true>>;
    });

    test('system fields are preserved in FlatModel', () => {
      type PostFlatModel = Schema['Post']['__meta']['flatModel'];

      type HasId = 'id' extends keyof PostFlatModel ? true : false;
      type HasCreatedAt = 'createdAt' extends keyof PostFlatModel
        ? true
        : false;
      type HasUpdatedAt = 'updatedAt' extends keyof PostFlatModel
        ? true
        : false;

      type test1 = Expect<Equal<HasId, true>>;
      type test2 = Expect<Equal<HasCreatedAt, true>>;
      type test3 = Expect<Equal<HasUpdatedAt, true>>;
    });

    test('nested model scalar fields are preserved', () => {
      type PostFlatModel = Schema['Post']['__meta']['flatModel'];
      type CommentElement =
        PostFlatModel['comments'] extends Array<infer C> ? C : never;

      // Explicitly defined fields are preserved
      type HasContent = 'content' extends keyof CommentElement ? true : false;
      type HasPostId = 'postId' extends keyof CommentElement ? true : false;

      type test1 = Expect<Equal<HasContent, true>>;
      type test2 = Expect<Equal<HasPostId, true>>;

      // Note: Implicit identifier (id) and system fields (createdAt, updatedAt)
      // are added at the FlatClientFields level, not during nested field resolution.
      // Nested models resolved through relationships only include explicitly defined fields.
    });
  });
});
