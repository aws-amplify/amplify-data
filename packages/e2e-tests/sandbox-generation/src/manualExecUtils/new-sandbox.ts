// import {
//   Client,
//   // configureAmplifyAndGenerateClient,
//   // expectDataReturnWithoutErrors,
// } from './utils';
// import type { Schema } from '../amplify/data/resource';
import { ampxCli } from '../utilsV8/process-controller/process_controller';
import {
  interruptSandbox,
  rejectCleanupSandbox,
  waitForSandboxDeploymentToPrintTotalTime,
} from '../utilsV8/process-controller/predicated_action_macros';
// import fs from 'fs/promises';

// npx ampx sandbox --profile mcafd-071724 --identifier nodeE2E

const test = async () => {
  const projectDirPath = './';
  // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
  await ampxCli(['sandbox', '--identifier', 'sandboxGenTest'], projectDirPath)
    // Reusable predicates: Wait for sandbox to finish and emit "File written: amplify_outputs.json"
    .do(waitForSandboxDeploymentToPrintTotalTime())
    // Wait for sandbox to become idle and then quit it (CTRL-C)
    .do(interruptSandbox())
    // Wait for sandbox to prompt on quitting to delete all the resource and respond with no
    .do(rejectCleanupSandbox())
    // Execute the sequence of actions queued on the process
    .run();
};

await test();
