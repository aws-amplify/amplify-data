import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a } from '../../index';
import type {
  CreateImplicitModelsFromRelations,
  ResolveFieldProperties,
} from '../../src/MappedTypes/ResolveFieldProperties';
import type { ExtractNonModelTypes } from '../../src/MappedTypes/ExtractNonModelTypes';
import type { Json } from '../../src/ModelField';
import type { ResolveSchema } from '../../src/MappedTypes/ResolveSchema';

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
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >
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

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      metadata?: Json;
      location?:
        | {
            lat?: number | null;
            long?: number | null;
          }
        | null
        | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Custom Type nests implicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        meta: a.ref('PostMeta'),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      PostMeta: a.customType({
        location: a.customType({
          lat: a.float().required(),
          long: a.float().required(),
        }),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      meta?:
        | {
            location?:
              | {
                  lat: number;
                  long: number;
                }
              | null
              | undefined;
          }
        | null
        | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Custom Type nests explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        meta: a.ref('PostMeta'),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      PostMeta: a.customType({
        location: a.ref('Location'),
      }),
      Location: a.customType({
        lat: a.float().required(),
        long: a.float().required(),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      meta?:
        | {
            location?:
              | {
                  lat: number;
                  long: number;
                }
              | null
              | undefined;
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

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      location: {
        lat?: number | null;
        long?: number | null;
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

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      metadata?: Json;
      location: {
        lat?: number | null;
        long?: number | null;
      };
      owner?: string | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Implicit Custom Type nests implicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        meta: a.customType({
          description: a.string().required(),
          status: a.enum(['value1', 'value2']),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        }),
      }),
      Comment: a.model({
        content: a.string(),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      meta?:
        | {
            status?: 'value1' | 'value2' | null | undefined;
            description: string;
            location?:
              | {
                  lat: number;
                  long: number;
                }
              | null
              | undefined;
          }
        | null
        | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Implicit Custom Type nests explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        meta: a.customType({
          description: a.string().required(),
          status: a.ref('Status').required(),
          location: a.ref('Location').required(),
        }),
      }),
      Comment: a.model({
        content: a.string(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
      Status: a.enum(['value1', 'value2']),
    });

    type Schema = typeof s;

    type Resolved = Prettify<
      ResolveFieldProperties<
        Schema,
        ResolveSchema<Schema>,
        ExtractNonModelTypes<Schema>,
        CreateImplicitModelsFromRelations<Schema, ResolveSchema<Schema>>
      >['Post']
    >;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      meta?:
        | {
            status: 'value1' | 'value2';
            description: string;
            location: {
              lat?: number | null | undefined;
              long?: number | null | undefined;
            };
          }
        | null
        | undefined;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
