import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
} from '../../utils';
import { Subscription } from 'rxjs';

describe('lazy loaders are populated by default', () => {
  let backgroundSub = null as Subscription | null;

  afterEach(() => {
    jest.clearAllMocks();
    backgroundSub?.unsubscribe();
    backgroundSub = null;
  });

  const schema = a
    .schema({
      Parent: a.model({
        name: a.string().required(),
        children: a.hasMany('HasManyChild', 'parentId'),
        child: a.hasOne('HasOneChild', 'parentId'),
        parentId: a.id().required(),
        parent: a.belongsTo('GrandParent', 'parentId'),
      }),
      HasManyChild: a.model({
        name: a.string().required(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
      HasOneChild: a.model({
        name: a.string().required(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
      GrandParent: a.model({
        children: a.hasMany('Parent', 'parentId'),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  // #region mocked data
  const sampleParent = {
    id: 'some-parent-id',
    name: 'some name',
    parentId: 'some-grandparent-id',
  };

  const sampleHasManyChild = {
    id: 'some-has-many-child-id',
    parentId: 'some-parent-id',
  };

  const sampleHasOneChild = {
    id: 'some-has-one-child-id',
    parentid: 'some-parent-id',
  };

  const sampleGrandparent = {
    id: 'some-grandparent-id',
  };

  const lazyLoadingScript = [
    { listHasManyChild: { items: [sampleHasManyChild], nextToken: null } },
    { listHasOneChild: { items: [sampleHasOneChild], nextToken: null } },
    { getGrandParent: sampleGrandparent },
  ];
  // #endregion mocked data

  async function getMockedClient<T extends Array<Record<string, object>>>(
    mockedResult: T,
  ) {
    const { subs, spy, generateClient } = mockedGenerateClient(
      [...mockedResult, ...lazyLoadingScript].map((result) => ({
        data: {
          ...result,
        },
      })),
    );
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();
    return { client, spy, subs };
  }

  async function expectAllLazyLoadersWork(parent: Schema['Parent']['type']) {
    const { data: hasManyChildren } = await parent.children();
    const { data: HasOneChild } = await parent.child();
    const { data: belongsToParent } = await parent.parent();

    expect(hasManyChildren[0]).toEqual(
      expect.objectContaining(sampleHasManyChild),
    );
    expect(HasOneChild).toEqual(expect.objectContaining(sampleHasOneChild));
    expect(belongsToParent).toEqual(expect.objectContaining(sampleGrandparent));
  }

  test('on `get` operation results', async () => {
    const { client } = await getMockedClient([{ getParent: sampleParent }]);

    const { data } = await client.models.Parent.get({
      id: 'some-parent-id',
    });

    await expectAllLazyLoadersWork(data!);
  });

  test('on `list` operation results', async () => {
    const { client } = await getMockedClient([
      { listParents: { items: [sampleParent], nextToken: null } },
    ]);

    const { data } = await client.models.Parent.list({});

    await expectAllLazyLoadersWork(data[0]!);
  });

  test('on `create` operation results', async () => {
    const { client } = await getMockedClient([{ createParent: sampleParent }]);

    const { data } = await client.models.Parent.create({
      name: 'some parent',
      parentId: 'some-grandparent-id',
    });

    await expectAllLazyLoadersWork(data!);
  });

  test('on `update` operation results', async () => {
    const { client } = await getMockedClient([{ updateParent: sampleParent }]);

    const { data } = await client.models.Parent.update({
      id: 'some-parent-id',
    });

    await expectAllLazyLoadersWork(data!);
  });

  // It seems a little strange to have lazy loaders on a deleted record. But, the deletion
  // of a record doesn't implicitly un-link related records. So, this actually provides a
  // reasonably sane mechanism to traverse a tree for deletion top-down instead of bottom-up
  // if desired.
  test('on `delete` operation results', async () => {
    const { client } = await getMockedClient([{ deleteParent: sampleParent }]);

    const { data } = await client.models.Parent.delete({
      id: 'some-parent-id',
    });

    await expectAllLazyLoadersWork(data!);
  });

  test('on `onCreate` operation results', async () => {
    const { client, subs } = await getMockedClient([]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.onCreate().subscribe({
        next(item) {
          resolve(item);
        },
      });
      subs.onCreateParent.next({
        data: {
          onCreateParent: { ...sampleParent },
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });

  test('on `onUpdate` operation results', async () => {
    const { client, subs } = await getMockedClient([]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.onUpdate().subscribe({
        next(item) {
          resolve(item);
        },
      });
      subs.onUpdateParent.next({
        data: {
          onUpdateParent: { ...sampleParent },
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });

  test('on `onDelete` operation results', async () => {
    const { client, subs } = await getMockedClient([]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.onDelete().subscribe({
        next(item) {
          resolve(item);
        },
      });
      subs.onDeleteParent.next({
        data: {
          onDeleteParent: { ...sampleParent },
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });

  test('on `observeQuery` operation initial results', async () => {
    const { client, subs } = await getMockedClient([
      { listParents: { items: [sampleParent], nextToken: null } },
    ]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.observeQuery().subscribe({
        next(data) {
          resolve(data.items[0]);
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });

  test('on `observeQuery` operation onCreate results', async () => {
    const { client, subs } = await getMockedClient([
      { listParents: { items: [sampleParent], nextToken: null } },
    ]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.observeQuery().subscribe({
        next(data) {
          for (const item of data.items) {
            if (item.id === 'new-parent-id') resolve(item);
          }
        },
      });
      subs.onCreateParent.next({
        data: {
          onCreateParent: {
            ...sampleParent,
            id: 'new-parent-id',
          },
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });

  test('on `observeQuery` operation onUpdate results', async () => {
    const { client, subs } = await getMockedClient([
      { listParents: { items: [sampleParent], nextToken: null } },
    ]);

    const data = await new Promise<Schema['Parent']['type']>((resolve) => {
      backgroundSub = client.models.Parent.observeQuery().subscribe({
        next(data) {
          for (const item of data.items) {
            if (item.name === 'updated name') resolve(item);
          }
        },
      });
      subs.onUpdateParent.next({
        data: {
          onUpdateParent: {
            ...sampleParent,
            name: 'updated name',
          },
        },
      });
    });

    await expectAllLazyLoadersWork(data);
  });
});
