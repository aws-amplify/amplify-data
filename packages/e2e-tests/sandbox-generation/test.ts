// import {
//   Client,
//   // configureAmplifyAndGenerateClient,
//   // expectDataReturnWithoutErrors,
// } from './utils';
// import type { Schema } from '../amplify/data/resource';
import { ampxCli } from './src/utilsV8/process-controller/process_controller';
import {
  // confirmDeleteSandbox,
  // interruptSandbox,
  // rejectCleanupSandbox,
  // waitForSandboxDeploymentToPrintTotalTime,
  confirmDeleteSandbox,
} from './src/utilsV8/process-controller/predicated_action_macros';
// import fs from 'fs/promises';

// const test = async () => {
//   const projectDirPath = './';
//   // await ampxCli(['sandbox'], projectDirPath, {
//   //   env: environment,
//   // })
//   // TODO: env???
//   // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
//   await ampxCli(['sandbox'], projectDirPath)
//     // Reusable predicates: Wait for sandbox to finish and emit "File written: amplify_outputs.json"
//     .do(waitForSandboxDeploymentToPrintTotalTime())
//     // Wait for sandbox to become idle and then quit it (CTRL-C)
//     .do(interruptSandbox())
//     // Wait for sandbox to prompt on quitting to delete all the resource and respond with no
//     .do(rejectCleanupSandbox())
//     // Execute the sequence of actions queued on the process
//     .run();
// };

const cleanup = async () => {
  const projectDirPath = './';
  await ampxCli(['sandbox', 'delete'], projectDirPath)
    .do(confirmDeleteSandbox())
    .run();
};

// test();

await cleanup();
