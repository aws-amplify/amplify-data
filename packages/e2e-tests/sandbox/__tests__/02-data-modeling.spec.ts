import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../../common/utils';
import type { Schema } from '../amplify-backends/02-data-modeling/amplify/data/resource';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils';
import { getGeneratedOutputs } from '../utils/outputsUtils';

const sandboxDir = '02-data-modeling';

// Location of generated Amplify backend for this test:
const projectDirPath = `./amplify-backends/${sandboxDir}`;

const sandboxIdentifier = 'data-modeling';

// TODO: use imported type from `aws-amplify/data` once it's fixed
type Client = ReturnType<typeof generateClient<Schema>>;

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.Customer.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (customer: Schema['Customer']['type']) => {
      await client.models.Customer.delete(customer);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Customer.list();
  console.log('result of cleanup:', listAfterDelete);
};

// TEMP: testing gen1 schema
describe.skip('Sandbox gen + runtime testing of docs data modeling schema', () => {
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
  test('Create', async () => {
    const response = await client.models.Customer.create({
      customerId: `${Date.now()}`,
      name: `test create`,
      location: {
        lat: 1.1,
        long: 2,
      },
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.name).toBe('test create');
  });
  afterAll(async () => {
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
