export type Schema = {
  Post: {
    __entityType: 'model';
    identifier: { readonly id: string; };
    secondaryIndexes: unknown;
    type: {
      title: string;
      description?: string | null;
      comments?: (options?: { authMode?: AuthMode; authToken?: string; limit?: number; nextToken?: string | null; headers?: CustomHeaders; } | undefined) => ListReturnValue<Schema['Comment']> | null;
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
    };
    createType: {
      title: string;
      description?: string | null;
      id?: string | undefined;
    };
    updateType: {
      id: string;
      title?: string;
      description?: string | null;
    };
    deleteType: {
      readonly id: string;
    };
    nestedTypes: {};
    __meta: { listOptionsPkParams: unknown; disabledOperations: {}; };
  };
  Comment: {
    __entityType: 'model';
    identifier: { readonly id: string; };
    secondaryIndexes: unknown;
    type: {
      content: string;
      views?: number | null;
      upvotes?: number | null;
      postId: string;
      post?: (options?: { authMode?: AuthMode; authToken?: string; headers?: CustomHeaders; } | undefined) => SingularReturnValue<Schema['Post']> | null;
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
    };
    createType: {
      content: string;
      views?: number | null;
      upvotes?: number | null;
      postId: string;
      id?: string | undefined;
    };
    updateType: {
      id: string;
      content?: string;
      views?: number | null;
      upvotes?: number | null;
      postId?: string;
    };
    deleteType: {
      readonly id: string;
    };
    nestedTypes: {};
    __meta: { listOptionsPkParams: unknown; disabledOperations: {}; };
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