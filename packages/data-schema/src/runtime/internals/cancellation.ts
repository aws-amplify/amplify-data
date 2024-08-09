import { BaseClient } from '../bridge-types';

/**
 * A map of cancellable promise "extensions".
 *
 * Each entry value must either be a directly `cancel()`-able promise, or must
 * refer to another entry.
 *
 * When cancellation of a promise is requested, cancel
 * will check to see if the promise exists in the map. If it does, it pulls
 * the value and repeats the check. If not, it will perform the underlying
 * cancel operation.
 */
const promiseMap = new Map<Promise<any>, Promise<any>>();

export function extendCancellability(
  existingCancellablePromise: Promise<any>,
  newPromiseToRegister: Promise<any>,
) {
  promiseMap.set(newPromiseToRegister, existingCancellablePromise);
  newPromiseToRegister.then(() => promiseMap.delete(newPromiseToRegister));
  newPromiseToRegister.catch(() => promiseMap.delete(newPromiseToRegister));
}

/**
 * Wraps the existing `cancel()` method with logic to iteratively search for
 * the corresponding base level promise, if needed, that the core graphql client
 * knows how to cancel.
 *
 * @param client
 */
export function upgradeClientCancellation(client: BaseClient) {
  const innerCancel = client.cancel.bind(client);

  client.cancel = function (
    promise: Promise<any>,
    message?: string | undefined,
  ): boolean {
    // cycles "shouldn't" occur if our implementation is sound. but, we're guarding
    // against cycles both in case our logic is *not* sound in any way and in case
    // the cancellability-promise-chaining logic is ever exposed in the public API.
    const visited = new Set<Promise<any>>();
    let targetPromise = promise;
    while (promiseMap.has(targetPromise) && !visited.has(targetPromise)) {
      visited.add(targetPromise);
      targetPromise = promiseMap.get(targetPromise)!;
    }
    return innerCancel(targetPromise, message);
  };
}
