import type { Equal, Expect } from '@aws-amplify/amplify-api-next-types-alpha';
import { a } from '../../index';
import {
  ResolveSchema,
  SchemaTypes,
  ModelTypes,
  FieldTypes,
} from '../../src/MappedTypes/ResolveSchema';

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
});
