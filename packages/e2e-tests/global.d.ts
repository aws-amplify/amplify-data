import { configureAmplifyAndGenerateClient } from './utils';

declare namespace NodeJS {
  interface Global {
    client: ReturnType<typeof configureAmplifyAndGenerateClient>;
  }
}
