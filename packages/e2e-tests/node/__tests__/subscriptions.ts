import {
  Client,
  configureAmplifyAndGenerateClient,
  addWebsocketPolyfill,
  waitForSubscriptionAck,
} from '../utils';
import { expectDataReturnWithoutErrors } from '../../common';
import type { Schema } from '../amplify/data/resource';

/**
 * Jest times out after 6 seconds if the promises aren't resolved, but the
 * `observeQuery` test sometimes takes longer than 6 seconds to complete.
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
  const { data: subTestModels } = await client.models.SubTestModel.list();
  console.log('subTestModels to delete:', subTestModels);

  const deletePromises = subTestModels?.map(
    async (subTestModel: Schema['SubTestModel']['type']) => {
      await client.models.SubTestModel.delete(subTestModel);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.SubTestModel.list();
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

    sub = client.models.SubTestModel.onCreate().subscribe({
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

    const firstCreateResponse = await client.models.SubTestModel.create({
      content: 'first subTestModel',
    });
    expectDataReturnWithoutErrors(
      firstCreateResponse,
      'first subTestModel create',
    );

    const secondCreateResponse = await client.models.SubTestModel.create({
      content: 'second subTestModel',
    });
    expectDataReturnWithoutErrors(
      secondCreateResponse,
      'second subTestModel create',
    );

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('first subTestModel');
    expect(subResult[1]?.content).toBe('second subTestModel');
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

    sub = client.models.SubTestModel.onUpdate().subscribe({
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

    const firstCreateResponse = await client.models.SubTestModel.create({
      content: 'first subTestModel',
    });
    const firstSubTestModel = expectDataReturnWithoutErrors(
      firstCreateResponse,
      'first subTestModel create',
    );

    const firstUpdateResponse = await client.models.SubTestModel.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstSubTestModel!.id,
      content: 'first update',
    });
    expectDataReturnWithoutErrors(firstUpdateResponse, 'first update');

    const secondUpdateResponse = await client.models.SubTestModel.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstSubTestModel!.id,
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

    sub = client.models.SubTestModel.onDelete().subscribe({
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

    const createResponse = await client.models.SubTestModel.create({
      content: 'subTestModel to delete',
    });

    const createdSubTestModel = expectDataReturnWithoutErrors(
      createResponse,
      'create',
    );

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    const deleteResponse = await client.models.SubTestModel.delete(
      createdSubTestModel!,
    );

    expectDataReturnWithoutErrors(deleteResponse, 'delete');

    // Wait for sub messages to be received before making assertions
    await subMsgsReceived;

    expect(subResult[0]?.content).toBe('subTestModel to delete');
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
      const firstCreateResponse = await client.models.SubTestModel.create({
        content: 'seeded subTestModel1',
      });
      const firstSubTestModel = expectDataReturnWithoutErrors(
        firstCreateResponse,
        'first create',
      );

      const secondCreateResponse = await client.models.SubTestModel.create({
        content: 'seeded subTestModel2',
      });
      const secondSubTestModel = expectDataReturnWithoutErrors(
        secondCreateResponse,
        'second create',
      );
      // #endregion

      sub = client.models.SubTestModel.observeQuery().subscribe({
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
       * Wait for snapshot to be received before creating the next subTestModel.
       * Otherwise the first snapshot will contain the new subTestModel, and we won't
       * be able to assert that the snapshot contains the seeded subTestModels.
       */
      await snapshotReceived;

      // Create a third subTestModel to trigger a new sub message:
      const thirdCreateResponse = await client.models.SubTestModel.create({
        content: 'created subTestModel after sub established',
      });
      const thirdSubTestModel = expectDataReturnWithoutErrors(
        thirdCreateResponse,
        'third create',
      );

      // Wait for snapshot to be received before making assertions:
      await allSubMsgsReceived;

      // Snapshot contains only the seeded subTestModels:
      expect(subResult[0].length).toBe(2);
      expect(subResult[0]).toContainEqual(firstSubTestModel);
      expect(subResult[0]).toContainEqual(secondSubTestModel);
      // Snapshot contains the seeded subTestModels and the new subTestModel
      expect(subResult[1].length).toBe(3);
      expect(subResult[1]).toContainEqual(firstSubTestModel);
      expect(subResult[1]).toContainEqual(secondSubTestModel);
      expect(subResult[1]).toContainEqual(thirdSubTestModel);
      // We receive the initial snapshot, as well as the msg for the new subTestModel:
      expect(subResult.length).toBe(2);
    },
    observeQueryTestTimeout,
  );
});
