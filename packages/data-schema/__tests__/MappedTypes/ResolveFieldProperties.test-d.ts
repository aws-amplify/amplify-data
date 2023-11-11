import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../../index';
import { ResolveFieldProperties } from '../../src/MappedTypes/ResolveFieldProperties';
import type { ExtractNonModelTypes } from '../../src/MappedTypes/ExtractNonModelTypes';
import { Json } from '../../src/ModelField';

describe('ResolveFieldProperties Mapped Type', () => {
  test('Basic schema', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
      }),
    });

    type Schema = typeof s;
    type Resolved = Prettify<
      ResolveFieldProperties<Schema, ExtractNonModelTypes<Schema>>
    >;

    type Expected = {
      Post: {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        metadata?: Json;
        title?: string | null | undefined;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        metadata: a.json(),
        location: a.ref('Location'),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Schema = typeof s;

    type CS = ClientSchema<Schema>;

    type Resolved = Prettify<
      ResolveFieldProperties<Schema, ExtractNonModelTypes<Schema>>['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      metadata?: Json;
      location?:
        | {
            lat: number | null;
            long: number | null;
          }
        | null
        | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit required Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        location: a.ref('Location').required(),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Schema = typeof s;

    type CS = ClientSchema<Schema>;

    type Resolved = Prettify<
      ResolveFieldProperties<Schema, ExtractNonModelTypes<Schema>>['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      location: {
        lat: number | null;
        long: number | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit required Custom Type with auth', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        metadata: a.json(),
        location: a.ref('Location').required().authorization([a.allow.owner()]),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Schema = typeof s;

    type CS = ClientSchema<Schema>;

    type Resolved = Prettify<
      ResolveFieldProperties<Schema, ExtractNonModelTypes<Schema>>['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      metadata?: Json;
      location: {
        lat: number | null;
        long: number | null;
      };
      owner?: string | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
