import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a } from '../../src/index';
import {
  ResolveSchema,
  SchemaTypes,
} from '../../src/MappedTypes/ResolveSchema';

import type {
  CreateImplicitModelsFromRelations,
  ResolveFieldProperties,
} from '../../src/MappedTypes/ResolveFieldProperties';
import type { NonModelTypesShape } from '../../src/MappedTypes/ExtractNonModelTypes';

import {
  ModelIdentifier,
  RelationalMetadata,
  ModelSecondaryIndexes,
} from '../../src/MappedTypes/ModelMetadata';
import { Json } from '../../src/ModelField';

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
            queryField: 'listByTitle';
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
            queryField: 'myFavIdx';
            pk: {
              title: string;
            };
            sk: {
              viewCount: number;
            };
          },
          {
            queryField: 'listByDescription';
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
      ResolveFieldProperties<
        Schema,
        NonModelTypesShape,
        ResolveSchema<Schema>,
        CreateImplicitModelsFromRelations<Schema>
      >,
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
        comments: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string(),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>,
      CreateImplicitModelsFromRelations<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = unknown;

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany bi-directional', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>,
      CreateImplicitModelsFromRelations<Schema>
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
          comments: a.hasMany('Comment'),
        })
        .identifier(['customPk']),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>,
      CreateImplicitModelsFromRelations<Schema>
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
          comments: a.hasMany('Comment'),
        })
        .identifier(['customPk', 'title']),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>,
      CreateImplicitModelsFromRelations<Schema>
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
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolveFieldProperties<
          Schema,
          NonModelTypesShape,
          ResolveSchema<Schema>,
          CreateImplicitModelsFromRelations<Schema>
        >,
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
        author: a.hasOne('Author'),
      }),
      Author: a.model({
        name: a.string(),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolveFieldProperties<
          Schema,
          NonModelTypesShape,
          ResolveSchema<Schema>,
          CreateImplicitModelsFromRelations<Schema>
        >,
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
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  // TODO: this test breaks with TS@5.3
  test('ManyToMany', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json().required(),
        postTags: a.manyToMany('Tag', { relationName: 'PostTag' }),
      }),
      Tag: a.model({
        name: a.string(),
        postTags: a.manyToMany('Post', { relationName: 'PostTag' }),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<
      Schema,
      NonModelTypesShape,
      ResolveSchema<Schema>,
      CreateImplicitModelsFromRelations<Schema>
    >;
    type Resolved = Prettify<
      RelationalMetadata<
        ResolveSchema<Schema>,
        ResolvedFields,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = Prettify<{
      PostTag: {
        relationalInputFields: {
          post?: {
            readonly id: string;
            readonly createdAt?: string;
            readonly updatedAt?: string;
            title?: string | null | undefined;
            // metadata: a.json().required() => Required<Json> removes `null` from the union
            // see packages/data-schema/src/ModelField.ts
            metadata?: Exclude<Json, null> | undefined;
            postTags?: ResolvedFields['Post']['postTags'];
          };
          tag?: {
            readonly id: string;
            readonly createdAt?: string;
            readonly updatedAt?: string;
            name?: string | null | undefined;
            postTags?: ResolvedFields['Tag']['postTags'];
          };
        };
      };
    }>;
    type test = Expect<Equal<Resolved, Expected>>;
  });
});
