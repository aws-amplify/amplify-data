import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

/**
 * Target: 1 simple model w/ 1700 fields each
 * Within limit: 1 model w/ 43 fields
 */
bench('1 simple model w/ 43 fields CRUDL', async () => {
  const s = a
    .schema({
      Model1: a.model({
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
      }),
    })
    .authorization([a.allow.public()]);

  type Schema = ClientSchema<typeof s>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  const result = await client.models.Model1.create({
    field1: 'test',
    field2: 'test',
    field3: 'test',
    field4: 'test',
    field5: 'test',
  });

  await client.models.Model1.get({ id: result.data.id });

  await client.models.Model1.update({
    id: result.data.id,
    field1: 'Updated Field 200',
  });

  await client.models.Model1.delete({ id: result.data.id });

  await client.models.Model1.list();
}).types([1606189, 'instantiations']);
