import type {
  Equal,
  Expect,
  Prettify,
} from '@aws-amplify/amplify-api-next-types-alpha';
import { a } from '../../index';
import {
  ResolveSchema,
  SchemaTypes,
} from '../../src/MappedTypes/ResolveSchema';

import type { ResolveFieldProperties } from '../../src/MappedTypes/ResolveFieldProperties';

import {
  ModelIdentifier,
  RelationalMetadata,
} from '../../src/MappedTypes/ModelMetadata';

describe('ModelIdentifier', () => {
  test('Default identifier', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
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
        })
        .identifier(['title', 'createdAt']),
    });

    type Schema = typeof s;

    type Resolved = ModelIdentifier<SchemaTypes<Schema>>;
    type Expected = { Post: { identifier: 'title' | 'createdAt' } };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});

describe('RelationalMetadata', () => {
  test('No meta for relation-less models', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),
    });

    type Schema = typeof s;

    type Resolved = RelationalMetadata<
      ResolveSchema<Schema>,
      ResolveFieldProperties<Schema>,
      ModelIdentifier<SchemaTypes<Schema>>
    >;

    type Expected = unknown;

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('HasMany', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        comments: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string(),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<Schema>;
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
                identifier: 'id';
                fields: {
                  readonly id: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  title?: string | null | undefined;
                  comments: ResolvedFields['Post']['comments'];
                };
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
        comments: a.hasMany('Comment'),
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<Schema>;
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
                identifier: 'id';
                fields: {
                  readonly id: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  title?: string | null | undefined;
                  comments: ResolvedFields['Post']['comments'];
                };
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
    // ModelName extends keyof IdentifierMeta
    type X = keyof ModelIdentifier<SchemaTypes<Schema>>;

    type ResolvedFields = ResolveFieldProperties<Schema>;
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
                identifier: 'customPk';
                fields: {
                  customPk: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  title?: string | null | undefined;
                  comments: ResolvedFields['Post']['comments'];
                };
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

    type ResolvedFields = ResolveFieldProperties<Schema>;
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
                identifier: 'title' | 'customPk';
                fields: {
                  customPk: string;
                  title: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  comments: ResolvedFields['Post']['comments'];
                };
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
        ResolveFieldProperties<Schema>,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Comment: {
        relationalInputFields: {
          post?:
            | {
                identifier: 'id';
                fields: {
                  readonly id: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  title?: string | null | undefined;
                };
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
        ResolveFieldProperties<Schema>,
        ModelIdentifier<SchemaTypes<Schema>>
      >
    >;

    type Expected = {
      Post: {
        relationalInputFields: {
          author?:
            | {
                identifier: 'id';
                fields: {
                  readonly id: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  name?: string | null | undefined;
                };
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('ManyToMany', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        postTags: a.manyToMany('Tag', { relationName: 'PostTag' }),
      }),
      Tag: a.model({
        name: a.string(),
        postTags: a.manyToMany('Post', { relationName: 'PostTag' }),
      }),
    });

    type Schema = typeof s;

    type ResolvedFields = ResolveFieldProperties<Schema>;
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
          post?:
            | { identifier: 'id'; fields: ResolvedFields['Post'] }
            | undefined;
          tag?: { identifier: 'id'; fields: ResolvedFields['Tag'] } | undefined;
        };
      };
    }>;

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
