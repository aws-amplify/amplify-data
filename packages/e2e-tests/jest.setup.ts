import { configureAmplifyAndGenerateClient } from './__tests__/utils';

(async function () {
  const client = await configureAmplifyAndGenerateClient();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.client = client;
})();
