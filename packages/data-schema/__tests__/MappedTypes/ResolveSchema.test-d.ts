import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a } from '../../src/index';
import { ResolveSchema } from '../../src/MappedTypes/ResolveSchema';
import type { _Internal_RefType, RefTypeParamShape } from '../../src/RefType';
import { _Internal_Authorization } from '../../src/Authorization';
import { _Internal_Json, __auth } from '../../src/ModelField';

describe('ResolveSchema Mapped Type', () => {
  test('Basic schema', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
        metadata: _Internal_Json;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Basic schema with explicit Custom Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        metadata: a.json(),
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
        metadata: _Internal_Json;
        location: _Internal_RefType<{
          link: 'Location';
          type: 'ref';
          valueRequired: false;
          array: false;
          arrayRequired: false;
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
        metadata: a.json(),
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
        metadata: _Internal_Json;
        location: _Internal_RefType<
          {
            link: 'Location';
            type: 'ref';
            valueRequired: true;
            array: false;
            arrayRequired: false;
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
        metadata: a.json(),
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
        metadata: _Internal_Json;
        location: _Internal_RefType<{
          link: 'Location';
          type: 'ref';
          valueRequired: false;
          array: false;
          arrayRequired: false;
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
        metadata: a.json(),
        privacy: a.ref('PrivacySetting'),
      }),
      PrivacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
        metadata: _Internal_Json;
        privacy: _Internal_RefType<{
          link: 'PrivacySetting';
          type: 'ref';
          valueRequired: false;
          array: false;
          arrayRequired: false;
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
        metadata: a.json(),
        privacy: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
      }),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
        metadata: _Internal_Json;
        privacy: _Internal_RefType<{
          link: 'PrivacySetting';
          type: 'ref';
          valueRequired: false;
          array: false;
          arrayRequired: false;
          authorization: [];
        }> | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with custom mutation', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),

      likePost: a
        .mutation()
        .arguments({ postId: a.string() })
        .returns(a.ref('Post')),
    });

    type Resolved = ResolveSchema<typeof s>;

    // Just like with custom types, custom ops are expected to
    // be removed from the ResolvedSchema
    type Expected = {
      Post: {
        title: string | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with custom query', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),

      getLikedPost: a.query().returns(a.ref('Post')),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Schema with custom subscription', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),

      likePost: a
        .mutation()
        .handler(
          a.handler.custom({
            entry: './likePost.js',
            dataSource: a.ref('Post'),
          }),
        )
        .authorization((allow) => allow.authenticated()),

      onUpdateOrLikePost: a
        .subscription()
        .for([a.ref('Post').mutations(['update']), a.ref('likePost')]),
    });

    type Resolved = ResolveSchema<typeof s>;

    type Expected = {
      Post: {
        title: string | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });
});
