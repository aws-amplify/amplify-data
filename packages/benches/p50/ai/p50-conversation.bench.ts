// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, type ClientSchema } from '@aws-amplify/data-schema';

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
 * The following benchmarks are `p50.bench.ts` but with 2 conversation routes added to schemas.
 */
bench('p50 conversation', () => {
  a.schema({
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
    ChatBot: a.conversation(input),
    GossipBot: a.conversation(input),
  }).authorization((allow) => allow.publicApiKey());
}).types([8514, 'instantiations']);

bench('p50 conversation w/ client types', () => {
  const s = a
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
      ChatBot: a.conversation(input),
      GossipBot: a.conversation(input),
    })
    .authorization((allow) => allow.publicApiKey());

  type _ = ClientSchema<typeof s>;
}).types([10441, 'instantiations']);

bench('p50 combined conversation w/ client types', () => {
  const s1 = a
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
      ChatBot: a.conversation(input),
      GossipBot: a.conversation(input),
    })
    .authorization((allow) => allow.publicApiKey());

  const s2 = a.schema({
    Todo: a
      .model({
        todoId: a.id().required(),
        name: a.string().required(),
        privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
        viewCount: a.integer(),
        complete: a.boolean(),
        employee: a.belongsTo('Employee', ['employeeId']),
      })
      .identifier(['todoId', 'name']),
    ChatBot: a.conversation(input),
    GossipBot: a.conversation(input),
  });

  const s = a.combine([s1, s2]);
  type _ = ClientSchema<typeof s>;
}).types([13892, 'instantiations']);
