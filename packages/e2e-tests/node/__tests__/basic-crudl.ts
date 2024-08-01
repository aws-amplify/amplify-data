import { Client, configureAmplifyAndGenerateClient } from '../utils';
import { expectDataReturnWithoutErrors } from '../../common';
import type { Schema } from '../amplify/data/resource';

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

describe('Basic CRUDL', () => {
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
  test('Read', async () => {
    const response = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel1',
    });

    expectDataReturnWithoutErrors(response, 'first create');

    const secondResponse = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel2',
    });

    const secondCRUDLTestModel = expectDataReturnWithoutErrors(
      secondResponse,
      'second create',
    );

    // Get the first crudlTestModel:
    const getResponse = await client.models.CRUDLTestModel.get({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: secondCRUDLTestModel!.id,
    });

    expectDataReturnWithoutErrors(getResponse, 'create');

    expect(getResponse.data?.content).toBe('crudlTestModel2');
  });
  test('Update', async () => {
    const createResponse = await client.models.CRUDLTestModel.create({
      content: 'original content',
    });

    const firstCRUDLTestModel = expectDataReturnWithoutErrors(
      createResponse,
      'create',
    );

    const updateResponse = await client.models.CRUDLTestModel.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstCRUDLTestModel!.id,
      content: 'updated content',
    });

    const updatedCRUDLTestModel = expectDataReturnWithoutErrors(
      updateResponse,
      'update',
    );

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    expect(updatedCRUDLTestModel!.content).toBe('updated content');
  });
  test('Delete', async () => {
    const createResponse = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel to delete',
    });

    const createdCRUDLTestModel = expectDataReturnWithoutErrors(
      createResponse,
      'create',
    );

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    const deleteResponse = await client.models.CRUDLTestModel.delete(
      createdCRUDLTestModel!,
    );

    const deletedCRUDLTestModel = expectDataReturnWithoutErrors(
      deleteResponse,
      'delete',
    );

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    expect(deletedCRUDLTestModel!.content).toBe('crudlTestModel to delete');
  });
  test('List', async () => {
    const firstCreateResponse = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel1',
    });
    expectDataReturnWithoutErrors(firstCreateResponse, 'first create');

    const secondCreateResponse = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel2',
    });
    expectDataReturnWithoutErrors(secondCreateResponse, 'second create');

    const thirdCreateResponse = await client.models.CRUDLTestModel.create({
      content: 'crudlTestModel3',
    });
    expectDataReturnWithoutErrors(thirdCreateResponse, 'third create');

    const listResponse = await client.models.CRUDLTestModel.list();
    expectDataReturnWithoutErrors(listResponse, 'list');

    expect(listResponse.data.length).toBe(3);
  });
});
