import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

let client: any;

const configureAmplify = () =>
  new Promise(async (resolve) => {
    Amplify.configure(outputs);
    resolve('configured!!');
  });

const getClient = () =>
  new Promise(async (resolve) => {
    client = generateClient<Schema>();
    resolve(client);
  });

const createRecord = () =>
  new Promise(async (resolve) => {
    const { data: todo } = await client.models.Todo.create({
      content: `${Date.now()}`,
    });

    resolve(todo);
  });

const deleteAll = () =>
  new Promise(async (resolve) => {
    console.log('delete all');

    const { data: todos, errors } = await client.models.Todo.list();

    console.log('starting delete for', todos);

    const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
      await client.models.Todo.delete(todo);
    });

    await Promise.all(deletePromises!);

    resolve('deleted all todos');
  });

configureAmplify()
  .then((configureResult) => {
    console.log(configureResult);
    return getClient();
  })
  .then(() => {
    return createRecord();
  })
  .then((createResult) => {
    console.log('create result:', createResult);
  })
  .then(() => {
    return deleteAll();
  })
  .then(() => {
    console.log('exiting..');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
