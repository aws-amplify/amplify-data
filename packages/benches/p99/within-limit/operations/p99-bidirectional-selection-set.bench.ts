import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

/**
 * This benchmark tests TypeScript performance with schemas that have
 * many bi-directional relationships - the pattern that caused TS2590 errors
 * before the FlatModel optimization.
 *
 * The schema creates a "hub and spoke" pattern where a central model (Hub)
 * has bi-directional relationships with multiple satellite models (Spoke1-N).
 * Each spoke also has relationships to other spokes, creating a dense graph.
 *
 * This is the worst-case scenario for selection set type generation because:
 * 1. Each bi-directional relationship creates potential for infinite recursion
 * 2. The number of possible paths grows exponentially with relationship count
 * 3. Without FlatModel optimization, this would cause TS2590 errors
 */

const selectionSet = ['name', 'spokes1.*', 'spokes2.*', 'spokes3.*'] as const;

bench('10 models with bi-directional relationships - selection set', async () => {
  const schema = a
    .schema({
      Hub: a.model({
        name: a.string().required(),
        spokes1: a.hasMany('Spoke1', 'hubId'),
        spokes2: a.hasMany('Spoke2', 'hubId'),
        spokes3: a.hasMany('Spoke3', 'hubId'),
        spokes4: a.hasMany('Spoke4', 'hubId'),
        spokes5: a.hasMany('Spoke5', 'hubId'),
      }),
      Spoke1: a.model({
        name: a.string().required(),
        hubId: a.id().required(),
        hub: a.belongsTo('Hub', 'hubId'),
        spoke2Id: a.id(),
        spoke2: a.belongsTo('Spoke2', 'spoke2Id'),
        spoke3s: a.hasMany('Spoke3', 'spoke1Id'),
      }),
      Spoke2: a.model({
        name: a.string().required(),
        hubId: a.id().required(),
        hub: a.belongsTo('Hub', 'hubId'),
        spoke1s: a.hasMany('Spoke1', 'spoke2Id'),
        spoke4Id: a.id(),
        spoke4: a.belongsTo('Spoke4', 'spoke4Id'),
      }),
      Spoke3: a.model({
        name: a.string().required(),
        hubId: a.id().required(),
        hub: a.belongsTo('Hub', 'hubId'),
        spoke1Id: a.id(),
        spoke1: a.belongsTo('Spoke1', 'spoke1Id'),
        spoke5Id: a.id(),
        spoke5: a.belongsTo('Spoke5', 'spoke5Id'),
      }),
      Spoke4: a.model({
        name: a.string().required(),
        hubId: a.id().required(),
        hub: a.belongsTo('Hub', 'hubId'),
        spoke2s: a.hasMany('Spoke2', 'spoke4Id'),
        spoke5s: a.hasMany('Spoke5', 'spoke4Id'),
      }),
      Spoke5: a.model({
        name: a.string().required(),
        hubId: a.id().required(),
        hub: a.belongsTo('Hub', 'hubId'),
        spoke3s: a.hasMany('Spoke3', 'spoke5Id'),
        spoke4Id: a.id(),
        spoke4: a.belongsTo('Spoke4', 'spoke4Id'),
      }),
      // Additional interconnected models
      Metadata: a.model({
        key: a.string().required(),
        value: a.string(),
        hubId: a.id(),
        hub: a.belongsTo('Hub', 'hubId'),
        tagId: a.id(),
        tag: a.belongsTo('Tag', 'tagId'),
      }),
      Tag: a.model({
        name: a.string().required(),
        metadata: a.hasMany('Metadata', 'tagId'),
        categoryId: a.id(),
        category: a.belongsTo('Category', 'categoryId'),
      }),
      Category: a.model({
        name: a.string().required(),
        tags: a.hasMany('Tag', 'categoryId'),
        groupId: a.id(),
        group: a.belongsTo('Group', 'groupId'),
      }),
      Group: a.model({
        name: a.string().required(),
        categories: a.hasMany('Category', 'groupId'),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

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

  // Test selection set with relationships
  await client.models.Hub.list({ selectionSet });

  // Test nested selection sets on different models
  await client.models.Spoke1.list({
    selectionSet: ['name', 'hub.*', 'spoke3s.*'],
  });

  await client.models.Category.list({
    selectionSet: ['name', 'tags.*', 'group.*'],
  });
}).types([241449, 'instantiations']);
