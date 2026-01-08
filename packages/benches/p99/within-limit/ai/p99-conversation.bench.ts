// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

const input = {
  aiModel: a.ai.model('Claude 3 Haiku'),
  systemPrompt: 'Hello, world!',
  inferenceConfiguration: {
    topP: 1,
    temperature: 1,
    maxTokens: 1000,
  },
};

bench('100 conversations', () => {
  a.schema({
    Conversation0: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation1: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation2: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation3: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation4: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation5: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation6: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation7: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation8: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation9: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation10: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation11: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation12: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation13: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation14: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation15: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation16: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation17: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation18: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation19: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation20: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation21: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation22: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation23: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation24: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation25: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation26: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation27: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation28: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation29: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation30: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation31: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation32: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation33: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation34: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation35: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation36: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation37: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation38: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation39: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation40: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation41: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation42: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation43: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation44: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation45: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation46: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation47: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation48: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation49: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation50: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation51: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation52: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation53: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation54: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation55: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation56: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation57: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation58: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation59: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation60: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation61: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation62: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation63: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation64: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation65: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation66: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation67: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation68: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation69: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation70: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation71: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation72: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation73: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation74: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation75: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation76: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation77: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation78: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation79: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation80: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation81: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation82: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation83: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation84: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation85: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation86: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation87: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation88: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation89: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation90: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation91: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation92: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation93: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation94: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation95: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation96: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation97: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation98: a.conversation(input)
      .authorization((allow) => allow.owner()),
    Conversation99: a.conversation(input)
      .authorization((allow) => allow.owner()),
  }).authorization((allow) => allow.publicApiKey());
}).types();

bench('100 conversations w/ client types', () => {
  const s = a
    .schema({
      Conversation0: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation1: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation2: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation3: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation4: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation5: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation6: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation7: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation8: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation9: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation10: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation11: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation12: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation13: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation14: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation15: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation16: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation17: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation18: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation19: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation20: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation21: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation22: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation23: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation24: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation25: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation26: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation27: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation28: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation29: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation30: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation31: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation32: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation33: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation34: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation35: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation36: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation37: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation38: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation39: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation40: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation41: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation42: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation43: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation44: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation45: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation46: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation47: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation48: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation49: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation50: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation51: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation52: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation53: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation54: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation55: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation56: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation57: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation58: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation59: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation60: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation61: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation62: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation63: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation64: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation65: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation66: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation67: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation68: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation69: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation70: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation71: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation72: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation73: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation74: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation75: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation76: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation77: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation78: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation79: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation80: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation81: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation82: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation83: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation84: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation85: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation86: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation87: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation88: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation89: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation90: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation91: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation92: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation93: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation94: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation95: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation96: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation97: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation98: a.conversation(input)
        .authorization((allow) => allow.owner()),
      Conversation99: a.conversation(input)
        .authorization((allow) => allow.owner()),
    })
    .authorization((allow) => allow.publicApiKey());

  type _ = ClientSchema<typeof s>;
}).types();
