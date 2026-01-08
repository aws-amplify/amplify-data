// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, type ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const input = {
  aiModel: a.ai.model('Claude 3 Haiku'),
  systemPrompt: 'Hello, world!',
  inferenceConfiguration: {
    topP: 1,
    temperature: 1,
    maxTokens: 1000,
  },
};

/**
 * The following benchmarks are an extension of `p50-conversation.bench.ts`.
 * Here we perform operations against a conversation route.
 */
bench('p50 conversation operations', async () => {
  const schema = a
    .schema({
      Employee: a
        .model({
          name: a.string().required(),
          email: a.email().authorization((allow) => allow.owner()),
          phone: a.phone().authorization((allow) => allow.owner()),
          website: a.url(),
          ssn: a.string().authorization((allow) => allow.owner()),
          todos: a.hasMany('Todo', ['employeeId']),
          posts: a.hasMany('Post', ['employeeId']),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', ['employeeId']),
        })
        .identifier(['todoId', 'name']),
      Post: a
        .model({
          name: a.string().default('My new Post'),
          notes: a.string().array(),
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
          lastViewedDate: a.date(),
          lastViewedTime: a.time(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', ['employeeId']),
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['read']),
          allow.owner(),
        ]),
      ChatBot: a.conversation(input)
        .authorization((allow) => allow.owner()),
      GossipBot: a.conversation(input)
        .authorization((allow) => allow.owner()),
    })
    .authorization((allow) => allow.publicApiKey());

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

  const { data: conversation } = await client.conversations.ChatBot.create();

  await client.conversations.ChatBot.list();

  conversation?.onStreamEvent({
    next: () => {},
    error: () => {},
  });

  await conversation?.sendMessage({
    content: [{ text: 'foo' }],
  });

  await conversation?.listMessages();
}).types();
