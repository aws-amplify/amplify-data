import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal, SelectionSet } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

describe('Enum', () => {
  describe('Inline Enum Type', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.enum(['draft', 'pending', 'published']),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('Return type', async () => {
      const { data: posts } = await client.models.Post.list();

      type ExpectedType = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        title: string;
        status: 'draft' | 'pending' | 'published' | null;
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;
    });

    test('Create input type', async () => {
      type ResolvedCreateParams = Parameters<
        typeof client.models.Post.create
      >[0];

      type ExpectedCreateParams = {
        id?: string;
        title: string;
        status?: 'draft' | 'pending' | 'published' | null;
      };

      type test = Expect<Equal<ResolvedCreateParams, ExpectedCreateParams>>;
    });

    test('Update input type', async () => {
      type ResolvedUpdateParams = Parameters<
        typeof client.models.Post.update
      >[0];

      type ExpectedUpdateParams = {
        id: string;
        title?: string;
        status?: 'draft' | 'pending' | 'published' | null;
      };

      type test = Expect<Equal<ResolvedUpdateParams, ExpectedUpdateParams>>;
    });

    test('The `.enums` property should contain expect enum type and values getter function', () => {
      type EnumsProp = typeof client.enums;

      type T = Schema['Post']['nestedTypes']['status'];

      type ExpectedEnumsPropShape = {
        PostStatus: {
          values(): ('draft' | 'pending' | 'published')[];
        };
      };

      type test = Expect<Equal<EnumsProp, ExpectedEnumsPropShape>>;
    });
  });

  describe('Explicit Enum Type; multiple models', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.ref('Status').required(),
      }),
      Comment: a.model({
        content: a.string().required(),
        status: a.ref('Status'),
      }),
      Status: a.enum(['draft', 'pending', 'published']),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('Return types', async () => {
      const { data: posts } = await client.models.Post.list();

      type ExpectedType = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        title: string;
        status: 'draft' | 'pending' | 'published';
      }[];

      type test = Expect<Equal<typeof posts, ExpectedType>>;

      const { data: comments } = await client.models.Comment.list();

      type ExpectedCommentType = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        content: string;
        status: 'draft' | 'pending' | 'published' | null;
      }[];

      type test2 = Expect<Equal<typeof comments, ExpectedCommentType>>;
    });

    test('Create input type', async () => {
      type ResolvedCreateParams = Parameters<
        typeof client.models.Post.create
      >[0];

      type ExpectedCreateParams = {
        id?: string;
        title: string;
        status: 'draft' | 'pending' | 'published';
      };

      type test = Expect<Equal<ResolvedCreateParams, ExpectedCreateParams>>;

      type ResolvedCreateCommentParams = Parameters<
        typeof client.models.Comment.create
      >[0];

      type ExpectedCreateCommentParams = {
        id?: string;
        content: string;
        status?: 'draft' | 'pending' | 'published' | null;
      };

      type test2 = Expect<
        Equal<ResolvedCreateCommentParams, ExpectedCreateCommentParams>
      >;
    });

    test('Update input type', async () => {
      type ResolvedUpdateParams = Parameters<
        typeof client.models.Post.update
      >[0];

      type ExpectedUpdateParams = {
        id: string;
        title?: string;
        status?: 'draft' | 'pending' | 'published';
      };

      type test = Expect<Equal<ResolvedUpdateParams, ExpectedUpdateParams>>;

      type ResolvedUpdateCommentParams = Parameters<
        typeof client.models.Comment.update
      >[0];

      type ExpectedUpdateCommentParams = {
        id: string;
        content?: string;
        status?: 'draft' | 'pending' | 'published' | null;
      };

      type test2 = Expect<
        Equal<ResolvedUpdateCommentParams, ExpectedUpdateCommentParams>
      >;
    });

    test('The `.enums` property should contain expect enum type and values getter function', () => {
      type EnumsProp = typeof client.enums;

      type ExpectedEnumsPropShape = {
        Status: {
          values(): ('draft' | 'pending' | 'published')[];
        };
      };

      type test = Expect<Equal<EnumsProp, ExpectedEnumsPropShape>>;
    });
  });
});
