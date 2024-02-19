import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { a } from '../../index';
import type { ExtractNonModelTypes } from '../../src/MappedTypes/ExtractNonModelTypes';

describe('ExtractNonModelTypes Mapped Type', () => {
  test('Basic schema', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    // empty objects when we have no non-model items
    type Expected = {
      enums: Record<never, never>;
      customTypes: Record<never, never>;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        location: a.ref('Location'),
        metadata: a.json(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: Record<never, never>;
      customTypes: {
        Location: {
          lat: number | null;
          long: number | null;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with implicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: Record<never, never>;
      customTypes: {
        PostLocation: {
          lat: number | null;
          long: number | null;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with multiple implicit Custom Types on one model', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
        altLocation: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: Record<never, never>;
      customTypes: {
        PostLocation: {
          lat: number | null;
          long: number | null;
        };
        PostAltLocation: {
          lat: number | null;
          long: number | null;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with implicit and explicit Custom Types on multiple models', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        location: a.ref('Location').required(),
      }),

      Post2: a.model({
        title: a.string().required(),
        description: a.string(),
        location: a.ref('Location'),
      }),

      Post3: a.model({
        title: a.string().required(),
        description: a.string(),
        altLocation: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),

      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: Record<never, never>;
      customTypes: {
        Location: {
          lat: number | null;
          long: number | null;
        };
        Post3AltLocation: {
          lat: number | null;
          long: number | null;
        };
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with explicit enum', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().array().required(),
        privacy: a.ref('PrivacySetting'),
      }),
      PrivacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: {
        PrivacySetting: 'PRIVATE' | 'FRIENDS_ONLY' | 'PUBLIC';
      };
      customTypes: Record<never, never>;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with implicit enum', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().array().required(),
        privacy: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
      }),
    });

    type Resolved = ExtractNonModelTypes<typeof s>;

    type Expected = {
      enums: {
        PostPrivacy: 'PRIVATE' | 'FRIENDS_ONLY' | 'PUBLIC';
      };
      customTypes: Record<never, never>;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
