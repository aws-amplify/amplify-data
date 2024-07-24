import {
  Client,
  configureAmplifyAndGenerateClient,
  establishWebsocket,
  expectDataReturnWithoutErrors,
  waitForSubscriptionAck,
} from '../utils';
import type { Schema } from '../amplify/data/resource';

let client: Client;

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

/**
 * Subscription returned by the client.
 * Set here so we can unsubscribe in `afterEach
 */
let sub: any;

// For collecting subscriptions messages to assert against:
let subResult: any[] = [];

describe('Subscriptions', () => {
  beforeAll(() => {
    establishWebsocket({});
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
    /**
     * We use a promise to wait for the correct number of sub messages to be
     * received.
     * Jest times out after 5 seconds if the promise isn't resolved.
     */
    let resolveSubPromise: () => void;
    const subMsgsReceived = new Promise<void>((resolve) => {
      resolveSubPromise = resolve;
    });

    sub = client.models.Todo.onCreate().subscribe({
      next: (data) => {
        subResult.push(data);
        if (subResult.length === 2) {
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
  });
  it('Update', async () => {
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
        if (subResult.length === 1) {
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

    const updateResponse = await client.models.Todo.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstTodo!.id,
      content: 'updated content',
    });
    expectDataReturnWithoutErrors(updateResponse, 'update');

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('updated content');
  });
  it('Delete', async () => {
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
        if (subResult.length === 1) {
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
  });
});
