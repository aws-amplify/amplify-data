/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { bench } from '@arktype/attest';
import { generateClient } from 'aws-amplify/api';

bench('basic schema w client types', async () => {
  type Schema = {
    Post: {
      __entityType: 'model';
      identifier: {
        readonly id: string;
      };
      secondaryIndexes: unknown;
      type: {
        title: string;
        comments: (
          options?:
            | {
                authMode?: AuthMode;
                authToken?: string;
                limit?: number;
                nextToken?: string | null;
                headers?: CustomHeaders;
              }
            | undefined,
        ) => ListReturnValue<Schema['Comment']>;
        description?: string | null | undefined;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
      };
      createType: {
        title: string;
        id?: string | undefined;
        description?: string | null | undefined;
      };
      updateType: {
        id: string;
        description?: string | null | undefined;
        title?: string | undefined;
      };
      deleteType: {
        readonly id: string;
      };
      nestedTypes: {};
      __meta: {
        listOptionsPkParams: unknown;
        disabledOperations: {};
      };
    };
    Comment: {
      __entityType: 'model';
      identifier: {
        readonly id: string;
      };
      secondaryIndexes: {
        listCommentByPostId: {
          input: {
            postId: string;
          };
        };
      };
      type: {
        content: string;
        postId: string;
        post: (
          options?:
            | {
                authMode?: AuthMode;
                authToken?: string;
                headers?: CustomHeaders;
              }
            | undefined,
        ) => SingularReturnValue<Schema['Post']>;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
      };
      createType: {
        id?: string | undefined;
        postId: string;
        content: string;
      };
      updateType: {
        id: string;
        postId?: string | undefined;
        content?: string | undefined;
      };
      deleteType: {
        readonly id: string;
      };
      nestedTypes: {};
      __meta: {
        listOptionsPkParams: unknown;
        disabledOperations: {};
      };
    };
  };

  // util types

  type ListReturnValue<T> = Promise<{
    data: Array<T>;
    nextToken?: string | null;
    errors?: GraphQLFormattedError[];
    extensions?: {
      [key: string]: any;
    };
  }>;

  type SingularReturnValue<T> = Promise<{
    data: T | null;
    errors?: GraphQLFormattedError[];
    extensions?: {
      [key: string]: any;
    };
  }>;

  type AuthMode =
    | 'apiKey'
    | 'iam'
    | 'identityPool'
    | 'oidc'
    | 'userPool'
    | 'lambda'
    | 'none';

  type RequestOptions = {
    url: string;
    queryString: string;
    method?: string;
  };

  type CustomHeaders =
    | Record<string, string>
    | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);

  interface SourceLocation {
    readonly line: number;
    readonly column: number;
  }

  interface GraphQLFormattedError {
    readonly message: string;
    readonly errorType: string;
    readonly errorInfo: null | { [key: string]: unknown };
    readonly locations?: ReadonlyArray<SourceLocation>;
    readonly path?: ReadonlyArray<string | number>;
    readonly extensions?: { [key: string]: unknown };
  }

  const client = generateClient<Schema>();

  // POST
  // query
  const _listPosts = await client.models.Post.list();
  const _getPost = await client.models.Post.get({ id: 'abc' });

  // mutation
  const _createPost = await client.models.Post.create({ title: 'hello' });
  const _updatePost = await client.models.Post.update({
    id: 'a1',
    title: 'goobye',
  });
  const _deletePost = await client.models.Post.delete({ id: 'a1' });

  // subscription
  client.models.Post.onCreate().subscribe({ next: () => null });
  client.models.Post.onUpdate().subscribe({ next: () => null });
  client.models.Post.onDelete().subscribe({ next: () => null });

  // COMMENT
  // query
  const _listComments = await client.models.Comment.list();
  const _getComment = await client.models.Comment.get({ id: 'abc' });
  const _listByPost = await client.models.Comment.listCommentByPostId({
    postId: 'a1',
  });

  // mutation
  const _createComment = await client.models.Comment.create({
    content: 'hello',
    postId: 'a1',
  });
  const _updateComment = await client.models.Comment.update({
    id: 'a1',
    content: 'goobye',
  });
  const _deleteComment = await client.models.Comment.delete({ id: 'a1' });

  // subscription
  client.models.Comment.onCreate().subscribe({ next: () => null });
  client.models.Comment.onUpdate().subscribe({ next: () => null });
  client.models.Comment.onDelete().subscribe({ next: () => null });
}).types([5760, 'instantiations']);
