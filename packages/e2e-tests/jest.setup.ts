import { configureAmplifyAndGenerateClient } from './utils';

(async function () {
  const client = await configureAmplifyAndGenerateClient();
  // TODO:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.client = client;
})();
