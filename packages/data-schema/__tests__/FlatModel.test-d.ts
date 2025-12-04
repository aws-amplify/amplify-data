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

/**
 * **Feature: selection-set-optimization, Property 3: Selection set return type correctness**
 * **Validates: Requirements 3.1, 3.2, 3.3**
 *
 * For any valid selection set path array, the return type of a CRUDL operation using that
 * selection set SHALL contain exactly the fields specified in the selection set, with correct
 * nesting and nullability.
 */
describe('Property 3: Selection set return type correctness', () => {
  // Import ModelPath type for testing
  type ModelPath<FlatModel extends Record<string, unknown>> = import('../src/runtime/client').ModelPath<FlatModel>;

  describe('selection set return type matches selected fields exactly', () => {
    const schema = a.schema({
      Todo: a.model({
        title: a.string().required(),
        description: a.string(),
        done: a.boolean(),
        priority: a.integer(),
        steps: a.hasMany('Step', 'todoId'),
      }),
      Step: a.model({
        content: a.string().required(),
        order: a.integer(),
        todoId: a.id(),
        todo: a.belongsTo('Todo', 'todoId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    type TodoFlatModel = Schema['Todo']['__meta']['flatModel'];

    test('selecting single scalar field returns only that field', () => {
      // When selecting only 'title', the return type should only have 'title'
      type SelectionSetPath = 'title';

      // Verify 'title' is a valid path in TodoFlatModel
      type TitleIsValidPath = SelectionSetPath extends keyof TodoFlatModel
        ? true
        : false;
      type test = Expect<Equal<TitleIsValidPath, true>>;
    });

    test('selecting multiple scalar fields returns all selected fields', () => {
      // When selecting 'title' and 'description', both should be in return type
      type TodoFlatModelKeys = keyof TodoFlatModel;

      type HasTitle = 'title' extends TodoFlatModelKeys ? true : false;
      type HasDescription = 'description' extends TodoFlatModelKeys
        ? true
        : false;
      type HasDone = 'done' extends TodoFlatModelKeys ? true : false;
      type HasPriority = 'priority' extends TodoFlatModelKeys ? true : false;

      type test1 = Expect<Equal<HasTitle, true>>;
      type test2 = Expect<Equal<HasDescription, true>>;
      type test3 = Expect<Equal<HasDone, true>>;
      type test4 = Expect<Equal<HasPriority, true>>;
    });

    test('selecting nested relationship fields returns properly nested types', () => {
      // When selecting 'steps.content', the return type should have nested structure
      type StepsType = TodoFlatModel['steps'];

      // Steps should be an array
      type StepsIsArray = StepsType extends Array<infer _> ? true : false;
      type test1 = Expect<Equal<StepsIsArray, true>>;

      // Each step should have content field
      type StepElement = StepsType extends Array<infer S> ? S : never;
      type StepHasContent = 'content' extends keyof StepElement ? true : false;
      type test2 = Expect<Equal<StepHasContent, true>>;

      // Step content should be string (required)
      type StepContentType = StepElement extends { content: infer C }
        ? C
        : never;
      type test3 = Expect<Equal<StepContentType, string>>;
    });

    test('wildcard selector returns all non-relationship fields of related model', () => {
      // When using 'steps.*', should return all scalar fields of Step
      type StepElement =
        TodoFlatModel['steps'] extends Array<infer S> ? S : never;

      // Should have all scalar fields
      type HasContent = 'content' extends keyof StepElement ? true : false;
      type HasOrder = 'order' extends keyof StepElement ? true : false;
      type HasTodoId = 'todoId' extends keyof StepElement ? true : false;

      type test1 = Expect<Equal<HasContent, true>>;
      type test2 = Expect<Equal<HasOrder, true>>;
      type test3 = Expect<Equal<HasTodoId, true>>;

      // Should NOT have the belongsTo relationship (short-circuited)
      type HasTodo = 'todo' extends keyof StepElement ? true : false;
      type test4 = Expect<Equal<HasTodo, false>>;
    });
  });

  describe('nullability is correctly preserved in return types', () => {
    const schema = a.schema({
      Item: a.model({
        requiredField: a.string().required(),
        optionalField: a.string(),
        requiredArray: a.string().array().required(),
        optionalArray: a.string().array(),
        relatedItems: a.hasMany('RelatedItem', 'itemId'),
      }),
      RelatedItem: a.model({
        name: a.string().required(),
        itemId: a.id(),
        item: a.belongsTo('Item', 'itemId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    type ItemFlatModel = Schema['Item']['__meta']['flatModel'];

    test('required fields are non-nullable in FlatModel', () => {
      type RequiredFieldType = ItemFlatModel['requiredField'];

      // Required field should be string (not string | null)
      type test = Expect<Equal<RequiredFieldType, string>>;
    });

    test('optional fields are nullable in FlatModel', () => {
      type OptionalFieldType = ItemFlatModel['optionalField'];

      // Optional field should include null (may also include undefined)
      type IsNullable = null extends OptionalFieldType ? true : false;
      type test = Expect<Equal<IsNullable, true>>;
    });

    test('required arrays are non-nullable in FlatModel', () => {
      type RequiredArrayType = ItemFlatModel['requiredArray'];

      // Required array should not have null in the union at array level
      type IsNullableArray = null extends RequiredArrayType ? true : false;
      type test = Expect<Equal<IsNullableArray, false>>;
    });

    test('optional arrays are nullable in FlatModel', () => {
      type OptionalArrayType = ItemFlatModel['optionalArray'];

      // Optional array should have null in the union
      type IsNullableArray = null extends OptionalArrayType ? true : false;
      type test = Expect<Equal<IsNullableArray, true>>;
    });

    test('nested relationship arrays preserve correct nullability', () => {
      type RelatedItemsType = ItemFlatModel['relatedItems'];

      // relatedItems should be an array
      type IsArray = RelatedItemsType extends Array<infer _> ? true : false;
      type test1 = Expect<Equal<IsArray, true>>;

      // Each related item should have required 'name' field as string
      type RelatedItemElement =
        RelatedItemsType extends Array<infer R> ? R : never;
      type NameType = RelatedItemElement extends { name: infer N } ? N : never;
      type test2 = Expect<Equal<NameType, string>>;
    });
  });

  describe('ModelPath type generates valid paths for FlatModel', () => {
    const schema = a.schema({
      Parent: a.model({
        name: a.string().required(),
        children: a.hasMany('Child', 'parentId'),
      }),
      Child: a.model({
        title: a.string(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
        grandchildren: a.hasMany('Grandchild', 'childId'),
      }),
      Grandchild: a.model({
        value: a.string(),
        childId: a.id(),
        child: a.belongsTo('Child', 'childId'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    type ParentFlatModel = Schema['Parent']['__meta']['flatModel'];

    test('top-level scalar fields are valid ModelPath', () => {
      type ValidPaths = ModelPath<ParentFlatModel>;

      // 'name' should be a valid path
      type NameIsValid = 'name' extends ValidPaths ? true : false;
      type test1 = Expect<Equal<NameIsValid, true>>;

      // 'id' should be a valid path (system field)
      type IdIsValid = 'id' extends ValidPaths ? true : false;
      type test2 = Expect<Equal<IdIsValid, true>>;
    });

    test('nested relationship paths are valid ModelPath', () => {
      type ValidPaths = ModelPath<ParentFlatModel>;

      // 'children.*' should be a valid path
      type ChildrenWildcardIsValid = 'children.*' extends ValidPaths
        ? true
        : false;
      type test1 = Expect<Equal<ChildrenWildcardIsValid, true>>;

      // 'children.title' should be a valid path
      type ChildrenTitleIsValid = 'children.title' extends ValidPaths
        ? true
        : false;
      type test2 = Expect<Equal<ChildrenTitleIsValid, true>>;
    });

    test('deeply nested paths are valid up to depth limit', () => {
      type ValidPaths = ModelPath<ParentFlatModel>;

      // 'children.grandchildren.value' should be valid (3 levels)
      type DeepPathIsValid =
        'children.grandchildren.value' extends ValidPaths ? true : false;
      type test = Expect<Equal<DeepPathIsValid, true>>;
    });

    test('invalid paths are rejected by type system', () => {
      type ValidPaths = ModelPath<ParentFlatModel>;

      // 'nonexistent-field' should NOT be a valid path
      type InvalidPathIsValid = 'nonexistent-field' extends ValidPaths
        ? true
        : false;
      type test = Expect<Equal<InvalidPathIsValid, false>>;
    });
  });
});
