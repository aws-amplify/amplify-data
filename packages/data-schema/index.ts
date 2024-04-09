import * as a from './src';
import { ClientSchema } from './src/ClientSchema';

export { a };

export type { ClientSchema };

export * from './src/runtime/client';
export {
  addSchemaToClient,
  addSchemaToClientWithInstance,
} from './src/runtime';
