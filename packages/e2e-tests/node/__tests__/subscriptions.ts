import {
  Client,
  configureAmplifyAndGenerateClient,
  addWebsocketPolyfill,
  expectDataReturnWithoutErrors,
  waitForSubscriptionAck,
} from '../utils';
import type { Schema } from '../amplify/data/resource';

/**
 * Jest times out after 5 seconds if the promises aren't resolved, but the
 * `observeQuery` test sometimes takes longer than 5 seconds to complete.
 */
const observeQueryTestTimeout: number = 6000;

let client: Client;

/**
 * Subscription returned by the client.
 * Set here so we can unsubscribe in `afterEach
 */
let sub: any;

// For collecting subscriptions messages to assert against:
let subResult: any[] = [];

const deleteAll = async (client: Client) => {
  const { data: todos } = await client.models.Todo.list();
  console.log('todos to delete:', todos);

  const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
    await client.models.Todo.delete(todo);
  });

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe('Subscriptions', () => {
  beforeAll(() => {
    /**
     * Adds the WebSocket API globally.
     * Subscriptions do not work in Node.js environment without the WebSocket API.
     */
    addWebsocketPolyfill({});
  });
  beforeEach(() => {
    client = configureAmplifyAndGenerateClient({});
  });
  afterEach(async () => {
    subResult = [];
    sub.unsubscribe();
    await deleteAll(client);
  });
  it('Create', async () => {
    const expectedNumberOfSubMsgs = 2;

    /**
     * We use a promise to wait for the correct number of sub messages to be
     * received.
     * Note: Jest times out after 5 seconds if the promise isn't resolved.
     */
    let resolveSubPromise: () => void;
    const subMsgsReceived = new Promise<void>((resolve) => {
      resolveSubPromise = resolve;
    });

    sub = client.models.Todo.onCreate().subscribe({
      next: (data) => {
        subResult.push(data);
        if (subResult.length === expectedNumberOfSubMsgs) {
          /**
           * Resolve the promise when second sub msg is received.
           * We resolve based on the number of sub messages, and not the content
           * of the sub msg, because we want to validate that we are receiving
           * both messages.
           */
          resolveSubPromise();
        }
      },
      error: (error) => new Error(JSON.stringify(error)),
    });

    /**
     * Need to wait for sub to be established before calling the API,
     * otherwise we'll miss the sub messages.
     */
    await waitForSubscriptionAck();

    const firstCreateResponse = await client.models.Todo.create({
      content: 'first todo',
    });
    expectDataReturnWithoutErrors(firstCreateResponse, 'first todo create');

    const secondCreateResponse = await client.models.Todo.create({
      content: 'second todo',
    });
    expectDataReturnWithoutErrors(secondCreateResponse, 'second todo create');

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('first todo');
    expect(subResult[1]?.content).toBe('second todo');
    expect(subResult.length).toBe(expectedNumberOfSubMsgs);
  });
  it('Update', async () => {
    const expectedNumberOfSubMsgs = 2;
    /**
     * We use a promise to wait for the correct number of sub messages to be
     * received.
     * Jest times out after 5 seconds if the promise isn't resolved.
     */
    let resolveSubPromise: () => void;
    const subMsgsReceived = new Promise<void>((resolve) => {
      resolveSubPromise = resolve;
    });

    sub = client.models.Todo.onUpdate().subscribe({
      next: (data) => {
        subResult.push(data);
        if (subResult.length === expectedNumberOfSubMsgs) {
          resolveSubPromise();
        }
      },
      error: (error) => new Error(JSON.stringify(error)),
    });

    /**
     * Need to wait for sub to be established before calling the API,
     * otherwise we'll miss the sub messages.
     */
    await waitForSubscriptionAck();

    const firstCreateResponse = await client.models.Todo.create({
      content: 'first todo',
    });
    const firstTodo = expectDataReturnWithoutErrors(
      firstCreateResponse,
      'first todo create',
    );

    const firstUpdateResponse = await client.models.Todo.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstTodo!.id,
      content: 'first update',
    });
    expectDataReturnWithoutErrors(firstUpdateResponse, 'first update');

    const secondUpdateResponse = await client.models.Todo.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstTodo!.id,
      content: 'final update',
    });
    expectDataReturnWithoutErrors(secondUpdateResponse, 'second update');

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('first update');
    expect(subResult[1]?.content).toBe('final update');
    expect(subResult.length).toBe(expectedNumberOfSubMsgs);
  });
  it('Delete', async () => {
    const expectedNumberOfSubMsgs = 1;
    /**
     * We use a promise to wait for the correct number of sub messages to be
     * received.
     * Jest times out after 5 seconds if the promise isn't resolved.
     */
    let resolveSubPromise: () => void;
    const subMsgsReceived = new Promise<void>((resolve) => {
      resolveSubPromise = resolve;
    });

    sub = client.models.Todo.onDelete().subscribe({
      next: (data) => {
        subResult.push(data);
        if (subResult.length === expectedNumberOfSubMsgs) {
          resolveSubPromise();
        }
      },
      error: (error) => new Error(JSON.stringify(error)),
    });

    /**
     * Need to wait for sub to be established before calling the API,
     * otherwise we'll miss the sub messages.
     */
    await waitForSubscriptionAck();

    const createResponse = await client.models.Todo.create({
      content: 'todo to delete',
    });

    const createdTodo = expectDataReturnWithoutErrors(createResponse, 'create');

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    const deleteResponse = await client.models.Todo.delete(createdTodo!);

    expectDataReturnWithoutErrors(deleteResponse, 'delete');

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('todo to delete');
    expect(subResult.length).toBe(expectedNumberOfSubMsgs);
  });
  it(
    'observeQuery',
    async () => {
      const expectedNumberOfSubMsgs = 2;
      /**
       * We use a promises to wait for the correct number of sub messages to be
       * received.
       * Note: Jest times out after 5 seconds if the promise isn't resolved.
       */
      let resolveSnapshotPromise: () => void;
      const snapshotReceived = new Promise<void>((resolve) => {
        resolveSnapshotPromise = resolve;
      });

      let resolveFinalSubPromise: () => void;
      const allSubMsgsReceived = new Promise<void>((resolve) => {
        resolveFinalSubPromise = resolve;
      });

      // #region - Seed data for first snapshot:
      const firstCreateResponse = await client.models.Todo.create({
        content: 'seeded todo1',
      });
      const firstTodo = expectDataReturnWithoutErrors(
        firstCreateResponse,
        'first create',
      );

      const secondCreateResponse = await client.models.Todo.create({
        content: 'seeded todo2',
      });
      const secondTodo = expectDataReturnWithoutErrors(
        secondCreateResponse,
        'second create',
      );
      // #endregion

      sub = client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          if (isSynced) {
            subResult.push(JSON.parse(JSON.stringify(items)));
            if (subResult.length === 1) {
              // Resolve the promise when the snapshot sub msg is received.
              resolveSnapshotPromise();
            } else if (subResult.length === expectedNumberOfSubMsgs) {
              // Resolve the promise when the second sub msg is received.
              resolveFinalSubPromise();
            }
          }
        },
        error: (error) => new Error(JSON.stringify(error)),
      });

      /**
       * Need to wait for sub to be established before calling the API,
       * otherwise we'll miss the sub messages.
       */
      await waitForSubscriptionAck();

      /**
       * Wait for snapshot to be received before creating the next todo.
       * Otherwise the first snapshot will contain the new todo, and we won't
       * be able to assert that the snapshot contains the seeded todos.
       */
      await snapshotReceived;

      // Create a third todo to trigger a new sub message:
      const thirdCreateResponse = await client.models.Todo.create({
        content: 'created todo after sub established',
      });
      const thirdTodo = expectDataReturnWithoutErrors(
        thirdCreateResponse,
        'third create',
      );

      // Wait for snapshot to be received before making assertions:
      await allSubMsgsReceived;

      // Snapshot contains only the seeded todos:
      expect(subResult[0].length).toBe(2);
      expect(subResult[0]).toContainEqual(firstTodo);
      expect(subResult[0]).toContainEqual(secondTodo);
      // Snapshot contains the seeded todos and the new todo
      expect(subResult[1].length).toBe(3);
      expect(subResult[1]).toContainEqual(firstTodo);
      expect(subResult[1]).toContainEqual(secondTodo);
      expect(subResult[1]).toContainEqual(thirdTodo);
      // We receive the initial snapshot, as well as the msg for the new todo:
      expect(subResult.length).toBe(2);
    },
    observeQueryTestTimeout,
  );
});
