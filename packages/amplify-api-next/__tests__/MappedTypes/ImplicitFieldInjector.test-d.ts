import type { Equal, Expect } from '@aws-amplify/amplify-data-next-types';
import { a, ClientSchema } from '../../index';

// TODO: once the top-level mapped types used by ClientSchema are extracted into separate files (src/MappedTypes/*.ts)
// change these tests to use `InjectImplicitModelFields` directly instead of via ClientSchema

describe('InjectImplicitModelFields Mapped Type', () => {
  test('Injects default implicit fields for basic schema', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof s>;

    type ExpectedFieldType = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title?: string | null | undefined;
    };

    type test = Expect<Equal<Schema['Post'], ExpectedFieldType>>;
  });

  test('Writable `id` when explicitly defined in model', () => {
    const s = a.schema({
      Post: a.model({
        id: a.id().required(),
        title: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof s>;

    type ExpectedFieldType = {
      // writable/NOT readonly
      id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title?: string | null | undefined;
    };

    type test = Expect<Equal<Schema['Post'], ExpectedFieldType>>;
  });

  test('Writable timestamps when explicitly defined in model', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
        createdAt: a.string(),
        updatedAt: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof s>;

    type ExpectedFieldType = {
      readonly id: string;
      // writable/NOT readonly
      createdAt?: string | null | undefined;
      // writable/NOT readonly
      updatedAt?: string | null | undefined;
      title?: string | null | undefined;
    };

    type test = Expect<Equal<Schema['Post'], ExpectedFieldType>>;
  });

  test('Implicit `id` is not added when model has a custom identifier', () => {
    const s = a.schema({
      Post: a
        .model({
          title: a.string().required(),
        })
        .identifier(['title']),
    });

    type Schema = ClientSchema<typeof s>;

    type ExpectedFieldType = {
      title: string;
      readonly createdAt: string;
      readonly updatedAt: string;
    };

    type test = Expect<Equal<Schema['Post'], ExpectedFieldType>>;
  });

  test('`id` remains writeable when model has a custom identifier that includes an explicit id', () => {
    const s = a.schema({
      Post: a
        .model({
          id: a.id().required(),
          title: a.string().required(),
        })
        .identifier(['id', 'title']),
    });

    type Schema = ClientSchema<typeof s>;

    type ExpectedFieldType = {
      id: string;
      title: string;
      readonly createdAt: string;
      readonly updatedAt: string;
    };

    type test = Expect<Equal<Schema['Post'], ExpectedFieldType>>;
  });
});
