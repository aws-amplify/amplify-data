import { ampxCli } from '../utils/process-controller/process_controller';
import { confirmDeleteSandbox } from '../utils/process-controller/predicated_action_macros';
import path from 'path';
import { deleteTestDirectory } from './setup_test_directory';

const outputsFileName = 'amplify_outputs.json';
const amplifyDirName = '.amplify';

/**
 * Util for tearing down a sandbox
 * @param amplifyBackendPath - location of Amplify backend for this test
 * @param sandboxIdentifier - identifier of the sandbox to delete
 */
export const teardownSandbox = async (
  amplifyBackendPath: string,
  // sandboxIdentifier: string,
) => {
  console.log('deleting sandbox..');

  // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
  await ampxCli(
    // ['sandbox', '--identifier', `${sandboxIdentifier}`, 'delete'],
    ['sandbox', 'delete'],
    amplifyBackendPath,
  )
    // Reusable predicated action: Wait for sandbox delete to prompt to delete all the resource and respond with yes
    .do(confirmDeleteSandbox())
    // Execute the sequence of actions queued on the process
    .run();

  const outputsPath = path.join(amplifyBackendPath, outputsFileName);
  await deleteTestDirectory(outputsPath);

  const amplifyPath = path.join(amplifyBackendPath, amplifyDirName);
  await deleteTestDirectory(amplifyPath);
};
