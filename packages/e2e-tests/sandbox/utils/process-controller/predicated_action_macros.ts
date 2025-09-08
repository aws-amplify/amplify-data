import { PredicatedActionBuilder } from './predicated_action_queue_builder';

/**
 * Convenience predicated actions that can be used to build up more complex CLI flows.
 */

/**
 * Reusable predicates: Wait for sandbox to finish and emit "✨  Total time: xx.xxs"
 */
export const waitForSandboxDeploymentToPrintTotalTime = () =>
  new PredicatedActionBuilder().waitForLineIncludes('Deployment completed in');

/**
 * Reusable predicates: Wait for sandbox to finish and emit "File written: amplify_outputs.json"
 */
export const waitForConfigUpdateAfterDeployment = () =>
  new PredicatedActionBuilder().waitForLineIncludes(
    'File written: amplify_outputs.json',
  );

/**
 * Reusable predicated action: Wait for sandbox delete to prompt to delete all the resource and respond with yes
 */
export const confirmDeleteSandbox = () =>
  new PredicatedActionBuilder()
    .waitForLineIncludes(
      'Are you sure you want to delete all the resources in your sandbox environment',
    )
    .sendYes();

/**
 * Reusable predicated action: Wait for sandbox to prompt on quitting to delete all the resource and respond with no
 */
export const rejectCleanupSandbox = () =>
  new PredicatedActionBuilder()
    .waitForLineIncludes(
      'Are you sure you want to delete all the resources in your sandbox environment',
    )
    .sendNo();

/**
 * Reusable predicated action: Wait for sandbox to become idle and then quit it (CTRL-C)
 */
export const interruptSandbox = () => waitForConfigUpdateAfterDeployment().sendCtrlC();
