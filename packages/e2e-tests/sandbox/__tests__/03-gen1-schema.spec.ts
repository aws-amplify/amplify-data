import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../../common/utils';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils';
import { getGeneratedOutputs } from '../utils/outputsUtils';

const sandboxDir = '03-gen1-schema';

// Location of generated Amplify backend for this test:
const projectDirPath = `./amplify-backends/${sandboxDir}`;

const sandboxIdentifier = 'gen1-schema';

let client: any;

const deleteAll = async (client: any) => {
  const { data: crudlTestModels } = await client.models.Customer.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(async (customer: any) => {
    await client.models.Customer.delete(customer);
  });

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Customer.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe('Sandbox gen + runtime testing of Gen 1 schema', () => {
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
    client = generateClient();
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  test('Create', async () => {
    const response = await client.models.Customer.create({
      content: 'test create',
      isDone: true,
    });

    const data: any = expectDataReturnWithoutErrors(response, 'create');

    expect(data.content).toBe('test create');
  });
  afterAll(async () => {
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
