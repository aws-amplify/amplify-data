// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, type ClientSchema } from '@aws-amplify/data-schema';
import { claude3Haiku } from '../../data-schema/dist/esm/ai/AiModelType';
import type { ConversationInput } from '../../data-schema/dist/esm/ai/ConversationType';

const input: ConversationInput = {
  aiModel: claude3Haiku(),
  systemPrompt: 'Hello, world!',
  inferenceConfiguration: {
    topP: 1,
    temperature: 1,
    maxTokens: 1000,
  },
};

bench('schema with conversation', () => {
  a.schema({
    Conversation: a.conversation(input),
  });
}).types([496, 'instantiations']);

bench('schema with conversation and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(input),
  });

  type _ = ClientSchema<typeof s>;
}).types([2445, 'instantiations']);

bench('schema with conversation and model', () => {
  a.schema({
    Conversation: a.conversation(input),
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([2418, 'instantiations']);

bench('schema with conversation, model and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(input),
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([4632, 'instantiations']);

bench('schema with generation returning primitive type w/ ClientSchema', () => {
  const s = a.schema({
    generate: a
      .generation()
      .arguments({ inputContent: a.string().required() })
      .returns(a.string().required())
      .handler(a.handler.function('customFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });

  type _ = ClientSchema<typeof s>;
}).types([12331, 'instantiations']);

bench('schema with generation returning enum type w/ ClientSchema', () => {
  const s = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    generate: a
      .generation()
      .arguments({ itemId: a.string().required() })
      .returns(a.ref('Status').required())
      .handler(a.handler.function('customFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });

  type _ = ClientSchema<typeof s>;
}).types([12529, 'instantiations']);

bench('schema with generation returning custom type w/ ClientSchema', () => {
  const s = a.schema({
    Recipe: a.customType({
      result: a.string(),
    }),
    makeRecipe: a
      .generation()
      .arguments({ inputContent: a.string().required() })
      .returns(a.ref('Recipe'))
      .handler(a.handler.function('customFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _ = ClientSchema<typeof s>;
}).types([12568, 'instantiations']);

bench('schema with generation returning model w/ ClientSchema', () => {
  const s = a.schema({
    Recipe: a.model({
      result: a.string(),
    }),
    makeRecipe: a
      .generation()
      .arguments({ modelId: a.string().required() })
      .returns(a.ref('Recipe'))
      .handler(a.handler.function('customFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _ = ClientSchema<typeof s>;
}).types([12646, 'instantiations']);
