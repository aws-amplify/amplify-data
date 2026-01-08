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

bench('schema with conversation', () => {
  a.schema({
    Conversation: a.conversation(input)
      .authorization((allow) => allow.owner()),
  });
}).types();

bench('schema with conversation and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(input)
      .authorization((allow) => allow.owner()),
  });

  type _ = ClientSchema<typeof s>;
}).types();

bench('schema with conversation and model', () => {
  a.schema({
    Conversation: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types();

bench('schema with conversation, model and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types();

bench('schema with generation returning primitive type w/ ClientSchema', () => {
  const s = a.schema({
    generate: a
      .generation({
        aiModel: a.ai.model('Claude 3 Haiku'),
        systemPrompt: 'Hello, world!',
      })
      .arguments({ inputContent: a.string().required() })
      .returns(a.string().required())
      .authorization((allow) => allow.publicApiKey()),
  });

  type _ = ClientSchema<typeof s>;
}).types();

bench('schema with generation returning enum type w/ ClientSchema', () => {
  const s = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    generate: a
      .generation({
        aiModel: a.ai.model('Claude 3 Haiku'),
        systemPrompt: 'Hello, world!',
      })
      .arguments({ itemId: a.string().required() })
      .returns(a.ref('Status').required())
      .authorization((allow) => allow.publicApiKey()),
  });

  type _ = ClientSchema<typeof s>;
}).types();

bench('schema with generation returning custom type w/ ClientSchema', () => {
  const s = a.schema({
    Recipe: a.customType({
      result: a.string(),
    }),
    makeRecipe: a
      .generation({
        aiModel: a.ai.model('Claude 3 Haiku'),
        systemPrompt: 'Hello, world!',
      })
      .arguments({ inputContent: a.string().required() })
      .returns(a.ref('Recipe'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _ = ClientSchema<typeof s>;
}).types();

bench('schema with generation returning model w/ ClientSchema', () => {
  const s = a.schema({
    Recipe: a.model({
      result: a.string(),
    }),
    makeRecipe: a
      .generation({
        aiModel: a.ai.model('Claude 3 Haiku'),
        systemPrompt: 'Hello, world!',
      })
      .arguments({ modelId: a.string().required() })
      .returns(a.ref('Recipe'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _ = ClientSchema<typeof s>;
}).types();
