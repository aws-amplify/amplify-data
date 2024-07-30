import { ampxCli } from '../utils/process-controller/process_controller';
import {
  interruptSandbox,
  rejectCleanupSandbox,
  waitForSandboxDeploymentToPrintTotalTime,
} from '../utils/process-controller/predicated_action_macros';
import fs from 'fs/promises';
import path from 'path';

const outputsFileName = 'amplify_outputs.json';

type DeploySandboxResponse = Promise<{ success: boolean } | { errors: Error }>;

/**
 * Util for deploying a sandbox
 * @param amplifyBackendPath - location of Amplify backend for this test
 * @param sandboxIdentifier - identifier for the sandbox
 * @returns {Promise<{ success: boolean } | { errors: Error }>}
 */
export const deploySandbox = async (
  amplifyBackendPath: string,
  sandboxIdentifier: string,
): DeploySandboxResponse => {
  console.log('Deploying sandbox..');

  // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI:
  await ampxCli(
    ['sandbox', '--identifier', `${sandboxIdentifier}`],
    amplifyBackendPath,
  )
    // Reusable predicates: Wait for sandbox to finish and emit "File written: amplify_outputs.json"
    .do(waitForSandboxDeploymentToPrintTotalTime())
    // Wait for sandbox to become idle and then quit it (CTRL-C)
    .do(interruptSandbox())
    // Wait for sandbox to prompt on quitting to delete all the resource and respond with no
    .do(rejectCleanupSandbox())
    // Execute the sequence of actions queued on the process
    .run();

  const outputsPath = path.join(amplifyBackendPath, outputsFileName);

  const clientConfigStats = await fs.stat(outputsPath);

  // Verify that `amplify_outputs.json` was generated:
  if (!clientConfigStats.isFile()) {
    return { errors: new Error('amplify_outputs.json not found') };
  } else {
    return { success: true };
  }
};
