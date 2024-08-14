/**
 *
 * @param resolver
 * @returns
 */
export function selfAwareAsync<T>(
  resolver: (promise: Promise<T>) => Promise<T>,
): Promise<T> {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;

  const resultPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  resolver(resultPromise)
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });

  return resultPromise;
}
