import { ClientSchema, a } from '@aws-amplify/data-schema';
import { Equal, Expect } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

describe('CustomType', () => {
  describe('inline', () => {
    describe('basic schema', () => {
      const schema = a.schema({
        Post: a.model({
          title: a.string().required(),
          meta: a.customType({
            author: a.string().required(),
            summary: a.string(),
          }),
        }),
      });

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      test('the `list` operation returns the expected type', async () => {
        const { data: posts } = await client.models.Post.list();

        type Expected = {
          title: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          meta: {
            summary: string | null;
            author: string;
          } | null;
        }[];

        type _ = Expect<Equal<typeof posts, Expected>>;
      });

      test('the `create` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.create
        >[0];

        type Expected = {
          id?: string | undefined;
          title: string;
          meta?:
            | {
                summary?: string | null | undefined;
                author: string;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });

      test('the `update` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.update
        >[0];

        type Expected = {
          id: string;
          title?: string | undefined;
          meta?:
            | {
                summary?: string | null | undefined;
                author: string;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });
    });

    describe('nests other inline non-model types', () => {
      const schema = a.schema({
        Post: a.model({
          title: a.string().required(),
          meta: a.customType({
            author: a.string().required(),
            summary: a.string(),
            status: a.enum(['unpublished', 'published']),
            deepMeta: a.customType({
              field1: a.integer().required(),
              field2: a.string(),
            }),
          }),
        }),
      });

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      test('the `list` operation returns the expected type', async () => {
        const { data: posts } = await client.models.Post.list();

        type Expected = {
          title: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          meta: {
            author: string;
            summary: string | null;
            status: 'unpublished' | 'published' | null;
            deepMeta: {
              field1: number;
              field2: string | null;
            } | null;
          } | null;
        }[];

        type _ = Expect<Equal<typeof posts, Expected>>;
      });

      test('the `create` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.create
        >[0];

        type Expected = {
          id?: string | undefined;
          title: string;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status?: 'unpublished' | 'published' | null | undefined;
                deepMeta?:
                  | {
                      field1: number;
                      field2?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });

      test('the `update` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.update
        >[0];

        type Expected = {
          id: string;
          title?: string | undefined;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status?: 'unpublished' | 'published' | null | undefined;
                deepMeta?:
                  | {
                      field1: number;
                      field2?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });
    });

    describe('nests other explicit non-model types', () => {
      const schema = a.schema({
        Post: a.model({
          title: a.string().required(),
          meta: a.customType({
            author: a.string().required(),
            summary: a.string(),
            status: a.ref('PostStatus').required(),
            deepMeta: a.ref('DeepMeta').required(),
          }),
        }),
        DeepMeta: a.customType({
          field1: a.integer().required(),
          field2: a.string(),
        }),
        PostStatus: a.enum(['unpublished', 'published']),
      });

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      test('the `list` operation returns the expected type', async () => {
        const { data: posts } = await client.models.Post.list();

        type Expected = {
          title: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          meta: {
            author: string;
            summary: string | null;
            status: 'unpublished' | 'published';
            deepMeta: {
              field1: number;
              field2: string | null;
            };
          } | null;
        }[];

        type _ = Expect<Equal<typeof posts, Expected>>;
      });

      test('the `create` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.create
        >[0];

        type Expected = {
          id?: string | undefined;
          title: string;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status: 'unpublished' | 'published';
                deepMeta: {
                  field1: number;
                  field2?: string | null | undefined;
                };
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });

      test('the `update` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.update
        >[0];

        type Expected = {
          id: string;
          title?: string | undefined;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status: 'unpublished' | 'published';
                deepMeta: {
                  field1: number;
                  field2?: string | null | undefined;
                };
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });
    });
  });

  describe('explicit', () => {
    describe('basic schema', () => {
      const schema = a.schema({
        Post: a.model({
          title: a.string().required(),
          meta: a.ref('PostMeta'),
        }),
        PostMeta: a.customType({
          author: a.string().required(),
          summary: a.string(),
        }),
      });

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      test('the `list` operation returns the expected type', async () => {
        const { data: posts } = await client.models.Post.list();

        type Expected = {
          title: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          meta: {
            summary: string | null;
            author: string;
          } | null;
        }[];

        type _ = Expect<Equal<typeof posts, Expected>>;
      });

      test('the `create` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.create
        >[0];

        type Expected = {
          id?: string | undefined;
          title: string;
          meta?:
            | {
                summary?: string | null | undefined;
                author: string;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });

      test('the `update` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.update
        >[0];

        type Expected = {
          id: string;
          title?: string | undefined;
          meta?:
            | {
                summary?: string | null | undefined;
                author: string;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });
    });

    describe('nests other inline non-model types', () => {
      const schema = a.schema({
        Post: a.model({
          title: a.string().required(),
          meta: a.ref('PostMeta'),
        }),
        PostMeta: a.customType({
          author: a.string().required(),
          summary: a.string(),
          status: a.enum(['unpublished', 'published']),
          deepMeta: a.customType({
            field1: a.integer().required(),
            field2: a.string(),
          }),
        }),
      });

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      test('the `list` operation returns the expected type', async () => {
        const { data: posts } = await client.models.Post.list();

        type Expected = {
          title: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          meta: {
            author: string;
            summary: string | null;
            status: 'unpublished' | 'published' | null;
            deepMeta: {
              field1: number;
              field2: string | null;
            } | null;
          } | null;
        }[];

        type _ = Expect<Equal<typeof posts, Expected>>;
      });

      test('the `create` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.create
        >[0];

        type Expected = {
          id?: string | undefined;
          title: string;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status?: 'unpublished' | 'published' | null | undefined;
                deepMeta?:
                  | {
                      field1: number;
                      field2?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });

      test('the `update` input type matches the expected type', () => {
        type ResolvedCreateInputType = Parameters<
          typeof client.models.Post.update
        >[0];

        type Expected = {
          id: string;
          title?: string | undefined;
          meta?:
            | {
                author: string;
                summary?: string | null | undefined;
                status?: 'unpublished' | 'published' | null | undefined;
                deepMeta?:
                  | {
                      field1: number;
                      field2?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        };

        type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
      });
    });

    describe('nests other explicit non-model types', () => {});
  });

  describe('nests other explicit non-model types', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        meta: a.ref('PostMeta'),
      }),
      PostMeta: a.customType({
        author: a.string().required(),
        summary: a.string(),
        status: a.ref('PostStatus').required(),
        deepMeta: a.ref('DeepMeta').required(),
      }),
      DeepMeta: a.customType({
        field1: a.integer().required(),
        field2: a.string(),
      }),
      PostStatus: a.enum(['unpublished', 'published']),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('the `list` operation returns the expected type', async () => {
      const { data: posts } = await client.models.Post.list();

      type Expected = {
        title: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        meta: {
          author: string;
          summary: string | null;
          status: 'unpublished' | 'published';
          deepMeta: {
            field1: number;
            field2: string | null;
          };
        } | null;
      }[];

      type _ = Expect<Equal<typeof posts, Expected>>;
    });

    test('the `create` input type matches the expected type', () => {
      type ResolvedCreateInputType = Parameters<
        typeof client.models.Post.create
      >[0];

      type Expected = {
        id?: string | undefined;
        title: string;
        meta?:
          | {
              author: string;
              summary?: string | null | undefined;
              status: 'unpublished' | 'published';
              deepMeta: {
                field1: number;
                field2?: string | null | undefined;
              };
            }
          | null
          | undefined;
      };

      type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
    });

    test('the `update` input type matches the expected type', () => {
      type ResolvedCreateInputType = Parameters<
        typeof client.models.Post.update
      >[0];

      type Expected = {
        id: string;
        title?: string | undefined;
        meta?:
          | {
              author: string;
              summary?: string | null | undefined;
              status: 'unpublished' | 'published';
              deepMeta: {
                field1: number;
                field2?: string | null | undefined;
              };
            }
          | null
          | undefined;
      };

      type _ = Expect<Equal<ResolvedCreateInputType, Expected>>;
    });
  });
});
