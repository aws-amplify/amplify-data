import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type { Expect, Equal } from '@aws-amplify/data-schema-types';
import type { SelectionSet } from 'aws-amplify/data';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  subOptionsAndHeaders,
  parseQuery,
} from '../../utils';

describe('custom operations with a selection set', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const dummyHandler = '' as any;

  const schema = a
    .schema({
      Author: a.model({
        name: a.string().required(),
        posts: a.hasMany('Post', 'authorId'),
      }),
      Post: a.model({
        title: a.string().required(),
        authorId: a.id().required(),
        author: a.belongsTo('Author', 'authorId'),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        body: a.string().required(),
        postId: a.id().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
      getFeaturedPost: a
        .query()
        .arguments({ slug: a.string().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function(dummyHandler)),
      listFeaturedPosts: a
        .query()
        .returns(a.ref('Post').array())
        .handler(a.handler.function(dummyHandler)),
      echo: a
        .query()
        .arguments({ value: a.string() })
        .returns(a.string())
        .handler(a.handler.function(dummyHandler)),
      likePost: a
        .mutation()
        .arguments({ postId: a.id().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function(dummyHandler)),
      onUpdatePostFromModel: a
        .subscription()
        .for(a.ref('Post').mutations(['update']))
        .handler(a.handler.function(dummyHandler)),
      onCreatePostFromMutation: a
        .subscription()
        .for(a.ref('likePost'))
        .handler(a.handler.function(dummyHandler)),
      onDeletePostMixed: a
        .subscription()
        .for([a.ref('Post').mutations(['delete']), a.ref('likePost')])
        .handler(a.handler.function(dummyHandler)),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  const sel = ['id', 'title', 'comments.*'] as const;

  test('query with a selection set returns plain data shaped by the paths', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          getFeaturedPost: {
            id: 'p1',
            title: 'Hello',
            comments: { items: [{ id: 'c1', body: 'nice' }] },
          },
        },
      },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    const { data } = await client.queries.getFeaturedPost(
      { slug: 'hello' },
      { selectionSet: sel },
    );

    expect(data).toEqual({
      id: 'p1',
      title: 'Hello',
      comments: [{ id: 'c1', body: 'nice' }],
    });
    type _ = Expect<
      Equal<typeof data, SelectionSet<Schema['Post'], typeof sel> | null>
    >;
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('query selection set string equals what model get emits for the same paths', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      { data: {} },
      { data: {} },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    await client.queries.getFeaturedPost(
      { slug: 'hello' },
      { selectionSet: sel },
    );
    await client.models.Post.get({ id: 'p1' }, { selectionSet: sel });

    const [[customOptions], [modelOptions]] = optionsAndHeaders(spy);
    expect(parseQuery(customOptions.query).selectionSetString).toContain(
      'comments',
    );
    expect(parseQuery(customOptions.query).selectionSetString).toEqual(
      parseQuery(modelOptions.query).selectionSetString,
    );
  });

  test('query without a selection set is unchanged: default fields and lazy loaders', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          getFeaturedPost: {
            id: 'p1',
            title: 'Hello',
            authorId: 'a1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    const { data } = await client.queries.getFeaturedPost({ slug: 'hello' });

    expect(typeof data?.comments).toBe('function');
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('array query with a selection set flattens each item and drops nulls', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          listFeaturedPosts: [
            null,
            { id: 'p1', title: 'a' },
            { id: 'p2', title: 'b' },
          ],
        },
      },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    const { data } = await client.queries.listFeaturedPosts({
      selectionSet: ['id', 'title'],
    });

    expect(data).toEqual([
      { id: 'p1', title: 'a' },
      { id: 'p2', title: 'b' },
    ]);
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test('mutation with a selection set returns plain data including a belongsTo', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          likePost: { id: 'p1', author: { id: 'a1', name: 'Ann' } },
        },
      },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    const { data } = await client.mutations.likePost(
      { postId: 'p1' },
      { selectionSet: ['id', 'author.*'] },
    );

    expect(data).toEqual({ id: 'p1', author: { id: 'a1', name: 'Ann' } });
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
  });

  test.each([
    ['onUpdatePostFromModel'],
    ['onCreatePostFromMutation'],
    ['onDeletePostMixed'],
  ] as const)('%s with a selection set emits plain data', async (name) => {
    const { subSpy, subs, generateClient } = mockedGenerateClient([]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    const next = jest.fn();
    client.subscriptions[name]({ selectionSet: ['id', 'title'] }).subscribe({
      next,
    });
    subs[name].next({ data: { [name]: { id: 'p1', title: 'Hello' } } });

    expect(next).toHaveBeenCalledWith({ id: 'p1', title: 'Hello' });
    expect(subOptionsAndHeaders(subSpy)).toMatchSnapshot();
  });

  test('selectionSetDepth applies to custom ops exactly as to model ops', async () => {
    type SchemaDepth1 = ClientSchema<typeof schema, { selectionSetDepth: 1 }>;
    const { generateClient } = mockedGenerateClient([
      { data: {} },
      { data: {} },
    ]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const d1 = generateClient<SchemaDepth1>();

    await d1.queries.getFeaturedPost(
      { slug: 'x' },
      { selectionSet: ['id', 'author.*'] },
    );
    await d1.queries.getFeaturedPost(
      { slug: 'x' },
      // @ts-expect-error second hop is stripped at depth 1
      { selectionSet: ['id', 'author.posts.*'] },
    );
  });

  test('an unknown path rejects a query exactly as it does on model get', async () => {
    const { generateClient } = mockedGenerateClient([]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    await expect(
      client.queries.getFeaturedPost(
        { slug: 'x' },
        { selectionSet: ['nope'] as any },
      ),
    ).rejects.toThrow('nope is not a field of model Post');
  });

  test('an unknown path throws synchronously on a subscription', async () => {
    const { generateClient } = mockedGenerateClient([]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    expect(() =>
      client.subscriptions.onUpdatePostFromModel({
        selectionSet: ['nope'] as any,
      }),
    ).toThrow('nope is not a field of model Post');
  });

  test('selectionSet is not offered on custom ops that do not return a model', async () => {
    const { generateClient } = mockedGenerateClient([{ data: { echo: 'x' } }]);
    Amplify.configure(await buildAmplifyConfig(schema));
    const client = generateClient<Schema>();

    await client.queries.echo(
      { value: 'x' },
      // @ts-expect-error selectionSet only exists on ops that return a model
      { selectionSet: ['value'] },
    );
  });
});
