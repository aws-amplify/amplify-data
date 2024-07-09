// const outputs = require('./amplify_outputs');
// const Amplify = require('aws-amplify');
// global.fetch = require('node-fetch');

import { Amplify } from 'aws-amplify';
import { generateClient } from "aws-amplify/data";
// import outputs from './amplify_outputs.json' assert { type: "json" };
import outputs from './amplify_outputs.json';

const configureAmplify = () => new Promise(async (resolve) => {
  Amplify.configure(outputs);
  resolve('configured!!');
});

const getClient = () => new Promise(async (resolve) => {
  const client = generateClient();
  resolve(client)
});

const createRecord = (client) => new Promise(async (resolve) => {
  const createResult = await client.models.Todo.create({
    content: `${Date.now()}`
  });
  resolve(createResult)
});

configureAmplify()
  .then((configureResult) => {
    console.log(configureResult)
    return getClient()
  }).then((client) => {
    console.log('client:', client)
    return createRecord(client);
  })
  .then((createResult) => {
    console.log('create result:', createResult);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })