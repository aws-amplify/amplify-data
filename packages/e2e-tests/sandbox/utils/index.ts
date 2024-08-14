import { deploySandbox } from './deploy';
import { teardownSandbox } from './teardown';

/**
 * Sandbox operations can sometimes be time consuming, so we increase the Jest
 * setup / teardown hook timeouts to 2 minutes.
 */
export const sandboxTimeout: number = 120000;

export const outputsFileName = 'amplify_outputs.json';

export { deploySandbox };
export { teardownSandbox };
