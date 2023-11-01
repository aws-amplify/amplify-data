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
      ResolveFieldProperties<Schema>
    >;

    type Expected = unknown;

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('No meta for relation-less models', () => {
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

    type Resolved = Prettify<
      RelationalMetadata<ResolveSchema<Schema>, ResolveFieldProperties<Schema>>
    >;

    type Expected = {
      Comment: {
        relationships: {
          comments?:
            | {
                readonly id: string;
                readonly createdAt: string;
                readonly updatedAt: string;
                content?: string | null | undefined;
              }
            | undefined;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
