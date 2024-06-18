// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('schema with conversation', () => {
  a.schema({
    Conversation: a.conversation(),
  });
}).types([496, 'instantiations']);

bench('schema with conversation and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(),
  });

  type _ = ClientSchema<typeof s>;
}).types([2445, 'instantiations']);

bench('schema with conversation and model', () => {
  a.schema({
    Conversation: a.conversation(),
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([2418, 'instantiations']);

bench('schema with conversation, model and client types', () => {
  const s = a.schema({
    Conversation: a.conversation(),
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([4632, 'instantiations']);
