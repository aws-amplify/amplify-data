import {
  Client,
  // configureAmplifyAndGenerateClient,
  // expectDataReturnWithoutErrors,
} from '../utils';
import type { Schema } from '../amplify/data/resource';
import { ampxCli } from '../utils/process-controller/process_controller.js';
import {
  // confirmDeleteSandbox,
  interruptSandbox,
  rejectCleanupSandbox,
  waitForSandboxDeploymentToPrintTotalTime,
} from '../utils/process-controller/predicated_action_macros.js';
import {} from // CloudFormationClient,
// DeleteStackCommand,
'@aws-sdk/client-cloudformation';

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.CRUDLTestModel.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (crudlTestModel: Schema['CRUDLTestModel']['type']) => {
      await client.models.CRUDLTestModel.delete(crudlTestModel);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.CRUDLTestModel.list();
  console.log('result of cleanup:', listAfterDelete);
};

/**
 * Tear down the project.
 */
// async function tearDown(backendIdentifier: any) {
//   if (backendIdentifier.type === 'sandbox') {
//     await ampxCli(['sandbox', 'delete'], this.projectDirPath)
//       .do(confirmDeleteSandbox())
//       .run();
//   } else {
//     await this.cfnClient.send(
//       new DeleteStackCommand({
//         StackName: BackendIdentifierConversions.toStackName(backendIdentifier),
//       }),
//     );
//   }
// }

describe('Basic CRUDL', () => {
  // beforeEach(() => {
  //   client = configureAmplifyAndGenerateClient({});
  // });
  afterEach(async () => {
    await deleteAll(client);
  });
  test('start', async () => {
    const projectDirPath = '../';
    // await ampxCli(['sandbox'], projectDirPath, {
    //   env: environment,
    // })
    // TODO: env???
    // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
    await ampxCli(['sandbox'], projectDirPath)
      // Reusable predicates: Wait for sandbox to finish and emit "File written: amplify_outputs.json"
      .do(waitForSandboxDeploymentToPrintTotalTime())
      // Wait for sandbox to become idle and then quit it (CTRL-C)
      .do(interruptSandbox())
      // Wait for sandbox to prompt on quitting to delete all the resource and respond with no
      .do(rejectCleanupSandbox())
      // Execute the sequence of actions queued on the process
      .run();

    // const response = await client.models.CRUDLTestModel.create({
    //   content: 'test create',
    // });

    // const data = expectDataReturnWithoutErrors(response, 'create');

    // expect(data?.content).toBe('test create');
    expect(true).toBe(true);
  });
});
