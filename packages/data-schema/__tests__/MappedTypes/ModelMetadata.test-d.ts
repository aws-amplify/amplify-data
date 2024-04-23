import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a } from '../../src/index';
import {
  ResolveSchema,
  SchemaTypes,
} from '../../src/MappedTypes/ResolveSchema';

import type { ResolveFieldProperties } from '../../src/MappedTypes/ResolveFieldProperties';
import type { NonModelTypesShape } from '../../src/MappedTypes/ExtractNonModelTypes';

import {
  ModelIdentifier,
  RelationalMetadata,
  ModelSecondaryIndexes,
} from '../../src/MappedTypes/ModelMetadata';
import { Json, Nullable } from '../../src/ModelField';

describe('ModelIdentifier', () => {
  test('Default identifier', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
      }),
    });

    type Schema = typeof s;

    type Resolved = ModelIdentifier<SchemaTypes<Schema>>;
    type Expected = { Post: { identifier: 'id' } };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Custom identifier', () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          metadata: a.json(),
        })
        .identifier(['title']),
    });

    type Schema = typeof s;

    type Resolved = ModelIdentifier<SchemaTypes<Schema>>;
    type Expected = { Post: { identifier: 'title' } };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Composite custom identifier', () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          createdAt: a.string().required(),
          metadata: a.json(),
        })
        .identifier(['title', 'createdAt']),
    });

    type Schema = typeof s;
    type Resolved = ModelIdentifier<SchemaTypes<Schema>>;
    type Expected = { Post: { identifier: 'title' | 'createdAt' } };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});

describe('ModelSecondaryIndexes', () => {
  test('Single GSI with PK', () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          description: a.string().required(),
          metadata: a.json(),
        })
        .secondaryIndexes((index) => [index('title')]),
    });

    type Resolved = ModelSecondaryIndexes<SchemaTypes<typeof s>>;

    type Expected = {
      Post: {
        secondaryIndexes: [
          {
            defaultQueryFieldSuffix: 'Title';
            queryField: never;
            pk: {
              title: string;
            };
            sk: never;
          },
        ];
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Multiple GSIs', () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
          description: a.string().required(),
          optField: a.string(),
          viewCount: a.integer(),
        })
        .secondaryIndexes((index) => [
          index('title').sortKeys(['viewCount']).queryField('myFavIdx'),
          index('description'),
        ]),
    });

    type Resolved = ModelSecondaryIndexes<SchemaTypes<typeof s>>;

    type Expected = {
      Post: {
        secondaryIndexes: [
          {
            defaultQueryFieldSuffix: 'TitleAndViewCount';
            queryField: 'myFavIdx';
            pk: {
              title: string;
            };
            sk: {
              viewCount: number;
            };
          },
          {
            defaultQueryFieldSuffix: 'Description';
            queryField: never;
            pk: {
              description: string;
            };
            sk: never;
          },
        ];
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});

describe('RelationalMetadata', () => {
  test('No meta for relation-less models', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
      }),
    });

    type Schema = typeof s;

    type Resolved = RelationalMetadata<
      ResolveSchema<Schema>,
      ResolveFieldProperties<Schema, NonModelTypesShape, ResolveSchema<Schema>>,
      ModelIdentifier<SchemaTypes<Schema>>
    >;

    type Expected = unknown;

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
        content: a.string(),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                readonly id: string;
                readonly createdAt?: string | undefined;
                readonly updatedAt?: string | undefined;
                title?: string | null | undefined;
                metadata?: Json | null | undefined;
                comments?: ResolvedFields['Post']['comments'];
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany bi-directional', () => {
    const s = a.schema({
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

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                readonly id: string;
                readonly createdAt?: string;
                readonly updatedAt?: string;
                title?: string | null | undefined;
                comments?: ResolvedFields['Post']['comments'];
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany bi-directional with custom identifier', () => {
    const s = a.schema({
      Post: a
        .model({
          customPk: a.id().required(),
          title: a.string(),
          comments: a.hasMany('Comment', 'postId'),
        })
        .identifier(['customPk']),
      Comment: a.model({
        content: a.string(),
        postId: a.id(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                customPk: string;
                readonly createdAt?: string;
                readonly updatedAt?: string;
                title?: string | null | undefined;
                comments?: ResolvedFields['Post']['comments'];
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany bi-directional with composite custom identifier', () => {
    const s = a.schema({
      Post: a
        .model({
          customPk: a.id().required(),
          title: a.string().required(),
          comments: a.hasMany('Comment', 'commentId'),
        })
        .identifier(['customPk', 'title']),
      Comment: a.model({
        content: a.string(),
        commentId: a.id(),
        post: a.belongsTo('Post', 'commentId'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                customPk: string;
                title: string;
                readonly createdAt?: string;
                readonly updatedAt?: string;
                comments?: ResolvedFields['Post']['comments'];
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('BelongsTo', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;

    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                readonly id: string;
                readonly createdAt?: string;
                readonly updatedAt?: string;
                title?: string | null | undefined;
                comments?: ResolvedFields['Post']['comments'];
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasOne', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        author: a.hasOne('Author', 'postId'),
      }),
      Author: a.model({
        name: a.string(),
        postId: a.id().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Post: {
        relationalInputFields: {
          author?:
            | {
                readonly id: string;
                readonly createdAt?: string;
                readonly updatedAt?: string;
                name?: string | null | undefined;
                postId?: string | undefined;
                post?: ResolvedFields['Author']['post'];
              }
            | undefined;
        };
      };
      Author: {
        relationalInputFields: {
          post?:
            | {
                title?: Nullable<string> | undefined;
                readonly createdAt?: string | undefined;
                readonly updatedAt?: string | undefined;
                author?: ResolvedFields['Post']['author'];
                readonly id: string;
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
