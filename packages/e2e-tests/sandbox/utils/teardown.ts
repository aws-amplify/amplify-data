import { ampxCli } from '../utils/process-controller/process_controller';
import { confirmDeleteSandbox } from '../utils/process-controller/predicated_action_macros';
import path from 'path';
import { existsSync } from 'fs';
import fs from 'fs/promises';

const outputsFileName = 'amplify_outputs.json';
const amplifyDirName = '.amplify';

/**
 * Delete a directory or file by path:
 */
export const deleteByPath = async (pathName: string | URL) => {
  if (existsSync(pathName)) {
    console.log(`Path exists, deleting ${pathName}`);
    await fs.rm(pathName, { recursive: true, force: true });
  } else {
    throw new Error(`Path to delete does not exist: ${pathName}`);
  }
};

/**
 * Util for tearing down a sandbox
 * @param amplifyBackendPath - location of Amplify backend for this test
 * @param sandboxIdentifier - identifier of the sandbox to delete
 */
export const teardownSandbox = async (amplifyBackendPath: string) => {
  console.log('deleting sandbox..');

  // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
  await ampxCli(['sandbox', 'delete'], amplifyBackendPath)
    // Reusable predicated action: Wait for sandbox delete to prompt to delete all the resource and respond with yes
    .do(confirmDeleteSandbox())
    // Execute the sequence of actions queued on the process
    .run();

  // Delete the Amplify outputs file
  const outputsPath = path.join(amplifyBackendPath, outputsFileName);
  await deleteByPath(outputsPath);

  // Delete the `.amplify` directory
  const amplifyPath = path.join(amplifyBackendPath, amplifyDirName);
  await deleteByPath(amplifyPath);
};
