import { ampxCli } from '../src/utilsV8/process-controller/process_controller';
import {
  confirmDeleteSandbox,
  interruptSandbox,
  rejectCleanupSandbox,
  waitForSandboxDeploymentToPrintTotalTime,
} from '../src/utilsV8/process-controller/predicated_action_macros';
import fs from 'fs/promises';
import {
  Client,
  configureAmplifyAndGenerateClient,
  expectDataReturnWithoutErrors,
} from '../../node/utils';
import type { Schema } from '../amplify/data/resource';
import { deleteTestDirectory } from '../src/utilsV8/setup_test_directory';

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

const sandboxGenTimeout: number = 60000;
const sandboxCleanupTimeout: number = 30000;

describe('Basic CRUDL w/ Sandbox Gen', () => {
  beforeAll(async () => {
    console.log('generating sandbox..');
    console.log('generating sandbox..');
    console.log('generating sandbox..');

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

    const clientConfigStats = await fs.stat('../amplify_outputs.json');
    console.log('clientConfigStats---------------------:', clientConfigStats);
    console.log('clientConfigStats:', clientConfigStats);
    console.log('clientConfigStats:', clientConfigStats);
    console.log('clientConfigStats:', clientConfigStats);
    console.log('clientConfigStats:', clientConfigStats);
    // Sandbox gen successfull:
    expect(clientConfigStats.isFile()).toBe(true);
  }, sandboxGenTimeout);
  beforeEach(() => {
    client = configureAmplifyAndGenerateClient({});
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  test('Create', async () => {
    const response = await client.models.CRUDLTestModel.create({
      content: 'test create',
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.content).toBe('test create');
  });
  afterAll(async () => {
    console.log('deleting sandbox..');
    const projectDirPath = './';

    // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
    await ampxCli(['sandbox', 'delete'], projectDirPath)
      // Reusable predicated action: Wait for sandbox delete to prompt to delete all the resource and respond with yes
      .do(confirmDeleteSandbox())
      // Execute the sequence of actions queued on the process
      .run();

    const outputsPath = './amplify_outputs.json';
    await deleteTestDirectory(outputsPath);

    const amplifyPath = './.amplify';
    await deleteTestDirectory(amplifyPath);
  }, sandboxCleanupTimeout);
});
