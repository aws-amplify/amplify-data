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
const promiseMap = new WeakMap<Promise<any>, Promise<any>>();

export function extendCancellability<T>(
  existingCancellablePromise: Promise<T>,
  newPromiseToRegister: Promise<any>,
): Promise<T> {
  promiseMap.set(newPromiseToRegister, existingCancellablePromise);

  return existingCancellablePromise.finally(() => {
    promiseMap.delete(newPromiseToRegister);
  });
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
    const visited = new Set<Promise<any>>();
    let targetPromise: Promise<any> | undefined = promise;

    while (targetPromise && promiseMap.has(targetPromise)) {
      if (visited.has(targetPromise))
        throw new Error(
          'A cycle was detected in the modeled graphql cancellation chain. This is a bug. Please report it!',
        );
      visited.add(targetPromise);
      targetPromise = promiseMap.get(targetPromise);
    }

    // call `innerCancel` with `targetPromise!` to defer to existing implementation
    // on how to handle `null | undefined` or otherwise "non-cancellable" objects.
    return innerCancel(targetPromise!, message);
  };
}
