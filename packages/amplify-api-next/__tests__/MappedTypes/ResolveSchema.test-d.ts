import type {
  Prettify,
  Equal,
  Expect,
} from '@aws-amplify/amplify-data-next-types';
import { a } from '../../index';
import { ResolveSchema } from '../../src/MappedTypes/ResolveSchema';
import type { RefType, RefTypeParamShape } from '../../src/RefType';
import { Authorization } from '../../src/Authorization';
import { __auth } from '../../src/ModelField';

describe('ResolveSchema Mapped Type', () => {
  test('Basic schema', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        location: a.ref('Location'),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    // Non-model type is removed from schema;
    // Field Ref remains
    type Expected = {
      Post: {
        title: string | null;
        location: RefType<{
          link: 'Location';
          type: 'ref';
          required: false;
          authorization: [];
        }> | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with explicit Custom Type - required', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        location: a.ref('Location').required(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    // Non-model type is removed from schema;
    // Field Ref remains
    type Expected = {
      Post: {
        title: string | null;
        location: RefType<
          {
            link: 'Location';
            type: 'ref';
            required: true;
            authorization: [];
          },
          'required'
        >;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with implicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    // Same result as explicit above; field is replaced with Ref
    type Expected = {
      Post: {
        title: string | null;
        location: RefType<{
          link: 'Location';
          type: 'ref';
          required: false;
          authorization: [];
        }> | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with explicit enum', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        privacy: a.ref('PrivacySetting'),
      }),
      PrivacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
        privacy: RefType<{
          link: 'PrivacySetting';
          type: 'ref';
          required: false;
          authorization: [];
        }> | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with implicit enum', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        privacy: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
        privacy: RefType<{
          link: 'PrivacySetting';
          type: 'ref';
          required: false;
          authorization: [];
        }> | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
