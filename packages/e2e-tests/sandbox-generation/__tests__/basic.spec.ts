import { ampxCli } from '../utils/process-controller/process_controller';
import {
  confirmDeleteSandbox,
  interruptSandbox,
  rejectCleanupSandbox,
  waitForSandboxDeploymentToPrintTotalTime,
} from '../utils/process-controller/predicated_action_macros';
import fs from 'fs/promises';
import {
  Client,
  configureAmplifyAndGenerateClient,
  expectDataReturnWithoutErrors,
} from '../../node/utils';
import type { Schema } from '../backends/00-basic-todo/amplify/data/resource';
import { deleteTestDirectory } from '../utils/setup_test_directory';
import path from 'path';

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

// Sandbox operations can be time consuming, so we set a timeout of 60 seconds:
const sandboxTimeout: number = 60000;

// Location of generated Amplify backend for this test:
const projectDirPath = './backends/00-basic-todo';

const outputsFileName = 'amplify_outputs.json';

const outputsPath = path.join(projectDirPath, outputsFileName);

describe('Basic CRUDL w/ Sandbox Gen', () => {
  beforeAll(async () => {
    console.log('Generating sandbox..');

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

    const clientConfigStats = await fs.stat(outputsPath);

    if (!clientConfigStats.isFile()) {
      throw new Error('amplify_outputs.json not found');
    }
  }, sandboxTimeout);
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

    // Factory function that returns a ProcessController for the Amplify Gen 2 Backend CLI
    await ampxCli(['sandbox', 'delete'], projectDirPath)
      // Reusable predicated action: Wait for sandbox delete to prompt to delete all the resource and respond with yes
      .do(confirmDeleteSandbox())
      // Execute the sequence of actions queued on the process
      .run();

    await deleteTestDirectory(outputsPath);

    const amplifyPath = path.join(projectDirPath, '.amplify');
    await deleteTestDirectory(amplifyPath);
  }, sandboxTimeout);
});
