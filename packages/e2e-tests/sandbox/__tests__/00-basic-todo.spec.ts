import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../utils/runtimeUtils';
import type { Schema } from '../amplify-backends/00-basic-todo/amplify/data/resource';
// import outputs from '../amplify-backends/00-basic-todo/amplify_outputs.json';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils/';
import fs from 'fs/promises';
import path from 'path';

// Location of generated Amplify backend for this test:
const projectDirPath = './amplify-backends/00-basic-todo';

const sandboxIdentifier = 'basicTodo';

// TODO: use imported type from `aws-amplify/data` once it's fixed
type Client = ReturnType<typeof generateClient<Schema>>;

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.Todo.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (crudlTestModel: Schema['Todo']['type']) => {
      await client.models.Todo.delete(crudlTestModel);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe('Sandbox gen + runtime testing of basic Todo schema', () => {
  beforeAll(async () => {
    const response = await deploySandbox(projectDirPath, sandboxIdentifier);

    if ('errors' in response) {
      console.log('errors----------');
      console.log('errors----------');
      console.log('errors----------');
      throw response.errors;
    }
  }, sandboxTimeout);
  beforeEach(async () => {
    console.log('before each----------------');
    console.log('before each----------------');
    console.log('before each----------------');
    console.log('before each----------------');
    console.log('before each----------------');
    // client = configureAmplifyAndGenerateClient({});
    // Wait until the file is generated
    const outputsFileName = 'amplify_outputs.json';
    const filePath = path.join(
      '../amplify-backends/00-basic-todo/',
      outputsFileName,
    );

    console.log('Waiting for file path to be generated??:', filePath);
    console.log('Waiting for file path to be generated??:', filePath);
    console.log('Waiting for file path to be generated??:', filePath);

    // while (!fs.existsSync(filePath)) {
    //   console.log('while----');
    //   console.log('while----');
    //   console.log('while----');
    //   console.log('while----');
    //   await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms before checking again
    // }

    async function pause(ms: number) {
      return new Promise((unsleep) => setTimeout(unsleep, ms));
    }

    await pause(5000);

    const clientConfigStats = await fs.stat(filePath);
    console.log('clientConfigStats!!!!!!!!:', clientConfigStats.isFile());

    // Dynamically require the file
    const outputs = await import(filePath);
    console.log('got here--------------------');
    console.log('got here--------------------');
    console.log('got here--------------------');
    console.log('got here--------------------');
    console.log(outputs);
    Amplify.configure(outputs);
    client = generateClient<Schema>();
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  // TODO: add more model operations
  test('Create', async () => {
    const response = await client.models.Todo.create({
      content: 'test create',
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.content).toBe('test create');
  });
  afterAll(async () => {
    // await teardownSandbox(projectDirPath, sandboxIdentifier);
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
