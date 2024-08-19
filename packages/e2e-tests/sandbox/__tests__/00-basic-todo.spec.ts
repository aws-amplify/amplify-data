import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../../common/utils';
import type { Schema } from '../amplify-backends/00-basic-todo/amplify/data/resource';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils/';
import { getGeneratedOutputs } from '../utils/outputsUtils';

const sandboxDir = '00-basic-todo';

// Location of generated Amplify backend for this test:
const projectDirPath = `./amplify-backends/${sandboxDir}`;

const sandboxIdentifier = 'basicTodo';

// TODO: use imported type from `aws-amplify/data` once it's fixed
type Client = ReturnType<typeof generateClient<Schema>>;

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: todos } = await client.models.Todo.list();
  console.log('todos to delete:', todos);

  const deletePromises = todos?.map(
    async (crudlTestModel: Schema['Todo']['type']) => {
      await client.models.Todo.delete(crudlTestModel);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe.skip('Sandbox gen + runtime testing of basic Todo schema', () => {
  beforeAll(async () => {
    // Deploy the sandbox
    const response = await deploySandbox(projectDirPath, sandboxIdentifier);

    if ('errors' in response) {
      throw response.errors;
    }
  }, sandboxTimeout);
  beforeEach(async () => {
    const { result, errors } = await getGeneratedOutputs(sandboxDir);

    if (errors) {
      throw errors;
    }

    Amplify.configure(result);
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
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
