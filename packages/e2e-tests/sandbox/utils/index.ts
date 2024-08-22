import { deploySandbox, deploySandboxWatch } from './deploy';
import { teardownSandbox } from './teardown';
import { updateSchema } from './schemaUtils';

/**
 * Sandbox operations can sometimes be time consuming, so we increase the Jest
 * setup / teardown hook timeouts to 10 minutes.
 */
export const sandboxTimeout: number = 600000;

export const outputsFileName = 'amplify_outputs.json';

export { deploySandbox, deploySandboxWatch };
export { teardownSandbox };
export { updateSchema };
