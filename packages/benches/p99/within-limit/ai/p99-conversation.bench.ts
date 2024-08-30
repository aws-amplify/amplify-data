// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

const input = {
  aiModel: a.ai.model.claude3Haiku(),
  systemPrompt: 'Hello, world!',
  inferenceConfiguration: {
    topP: 1,
    temperature: 1,
    maxTokens: 1000,
  },
};

bench('100 conversations', () => {
  a.schema({
    Conversation0: a.conversation(input),
    Conversation1: a.conversation(input),
    Conversation2: a.conversation(input),
    Conversation3: a.conversation(input),
    Conversation4: a.conversation(input),
    Conversation5: a.conversation(input),
    Conversation6: a.conversation(input),
    Conversation7: a.conversation(input),
    Conversation8: a.conversation(input),
    Conversation9: a.conversation(input),
    Conversation10: a.conversation(input),
    Conversation11: a.conversation(input),
    Conversation12: a.conversation(input),
    Conversation13: a.conversation(input),
    Conversation14: a.conversation(input),
    Conversation15: a.conversation(input),
    Conversation16: a.conversation(input),
    Conversation17: a.conversation(input),
    Conversation18: a.conversation(input),
    Conversation19: a.conversation(input),
    Conversation20: a.conversation(input),
    Conversation21: a.conversation(input),
    Conversation22: a.conversation(input),
    Conversation23: a.conversation(input),
    Conversation24: a.conversation(input),
    Conversation25: a.conversation(input),
    Conversation26: a.conversation(input),
    Conversation27: a.conversation(input),
    Conversation28: a.conversation(input),
    Conversation29: a.conversation(input),
    Conversation30: a.conversation(input),
    Conversation31: a.conversation(input),
    Conversation32: a.conversation(input),
    Conversation33: a.conversation(input),
    Conversation34: a.conversation(input),
    Conversation35: a.conversation(input),
    Conversation36: a.conversation(input),
    Conversation37: a.conversation(input),
    Conversation38: a.conversation(input),
    Conversation39: a.conversation(input),
    Conversation40: a.conversation(input),
    Conversation41: a.conversation(input),
    Conversation42: a.conversation(input),
    Conversation43: a.conversation(input),
    Conversation44: a.conversation(input),
    Conversation45: a.conversation(input),
    Conversation46: a.conversation(input),
    Conversation47: a.conversation(input),
    Conversation48: a.conversation(input),
    Conversation49: a.conversation(input),
    Conversation50: a.conversation(input),
    Conversation51: a.conversation(input),
    Conversation52: a.conversation(input),
    Conversation53: a.conversation(input),
    Conversation54: a.conversation(input),
    Conversation55: a.conversation(input),
    Conversation56: a.conversation(input),
    Conversation57: a.conversation(input),
    Conversation58: a.conversation(input),
    Conversation59: a.conversation(input),
    Conversation60: a.conversation(input),
    Conversation61: a.conversation(input),
    Conversation62: a.conversation(input),
    Conversation63: a.conversation(input),
    Conversation64: a.conversation(input),
    Conversation65: a.conversation(input),
    Conversation66: a.conversation(input),
    Conversation67: a.conversation(input),
    Conversation68: a.conversation(input),
    Conversation69: a.conversation(input),
    Conversation70: a.conversation(input),
    Conversation71: a.conversation(input),
    Conversation72: a.conversation(input),
    Conversation73: a.conversation(input),
    Conversation74: a.conversation(input),
    Conversation75: a.conversation(input),
    Conversation76: a.conversation(input),
    Conversation77: a.conversation(input),
    Conversation78: a.conversation(input),
    Conversation79: a.conversation(input),
    Conversation80: a.conversation(input),
    Conversation81: a.conversation(input),
    Conversation82: a.conversation(input),
    Conversation83: a.conversation(input),
    Conversation84: a.conversation(input),
    Conversation85: a.conversation(input),
    Conversation86: a.conversation(input),
    Conversation87: a.conversation(input),
    Conversation88: a.conversation(input),
    Conversation89: a.conversation(input),
    Conversation90: a.conversation(input),
    Conversation91: a.conversation(input),
    Conversation92: a.conversation(input),
    Conversation93: a.conversation(input),
    Conversation94: a.conversation(input),
    Conversation95: a.conversation(input),
    Conversation96: a.conversation(input),
    Conversation97: a.conversation(input),
    Conversation98: a.conversation(input),
    Conversation99: a.conversation(input),
  }).authorization((allow) => allow.publicApiKey());
}).types([1070, 'instantiations']);

bench('100 conversations w/ client types', () => {
  const s = a
    .schema({
      Conversation0: a.conversation(input),
      Conversation1: a.conversation(input),
      Conversation2: a.conversation(input),
      Conversation3: a.conversation(input),
      Conversation4: a.conversation(input),
      Conversation5: a.conversation(input),
      Conversation6: a.conversation(input),
      Conversation7: a.conversation(input),
      Conversation8: a.conversation(input),
      Conversation9: a.conversation(input),
      Conversation10: a.conversation(input),
      Conversation11: a.conversation(input),
      Conversation12: a.conversation(input),
      Conversation13: a.conversation(input),
      Conversation14: a.conversation(input),
      Conversation15: a.conversation(input),
      Conversation16: a.conversation(input),
      Conversation17: a.conversation(input),
      Conversation18: a.conversation(input),
      Conversation19: a.conversation(input),
      Conversation20: a.conversation(input),
      Conversation21: a.conversation(input),
      Conversation22: a.conversation(input),
      Conversation23: a.conversation(input),
      Conversation24: a.conversation(input),
      Conversation25: a.conversation(input),
      Conversation26: a.conversation(input),
      Conversation27: a.conversation(input),
      Conversation28: a.conversation(input),
      Conversation29: a.conversation(input),
      Conversation30: a.conversation(input),
      Conversation31: a.conversation(input),
      Conversation32: a.conversation(input),
      Conversation33: a.conversation(input),
      Conversation34: a.conversation(input),
      Conversation35: a.conversation(input),
      Conversation36: a.conversation(input),
      Conversation37: a.conversation(input),
      Conversation38: a.conversation(input),
      Conversation39: a.conversation(input),
      Conversation40: a.conversation(input),
      Conversation41: a.conversation(input),
      Conversation42: a.conversation(input),
      Conversation43: a.conversation(input),
      Conversation44: a.conversation(input),
      Conversation45: a.conversation(input),
      Conversation46: a.conversation(input),
      Conversation47: a.conversation(input),
      Conversation48: a.conversation(input),
      Conversation49: a.conversation(input),
      Conversation50: a.conversation(input),
      Conversation51: a.conversation(input),
      Conversation52: a.conversation(input),
      Conversation53: a.conversation(input),
      Conversation54: a.conversation(input),
      Conversation55: a.conversation(input),
      Conversation56: a.conversation(input),
      Conversation57: a.conversation(input),
      Conversation58: a.conversation(input),
      Conversation59: a.conversation(input),
      Conversation60: a.conversation(input),
      Conversation61: a.conversation(input),
      Conversation62: a.conversation(input),
      Conversation63: a.conversation(input),
      Conversation64: a.conversation(input),
      Conversation65: a.conversation(input),
      Conversation66: a.conversation(input),
      Conversation67: a.conversation(input),
      Conversation68: a.conversation(input),
      Conversation69: a.conversation(input),
      Conversation70: a.conversation(input),
      Conversation71: a.conversation(input),
      Conversation72: a.conversation(input),
      Conversation73: a.conversation(input),
      Conversation74: a.conversation(input),
      Conversation75: a.conversation(input),
      Conversation76: a.conversation(input),
      Conversation77: a.conversation(input),
      Conversation78: a.conversation(input),
      Conversation79: a.conversation(input),
      Conversation80: a.conversation(input),
      Conversation81: a.conversation(input),
      Conversation82: a.conversation(input),
      Conversation83: a.conversation(input),
      Conversation84: a.conversation(input),
      Conversation85: a.conversation(input),
      Conversation86: a.conversation(input),
      Conversation87: a.conversation(input),
      Conversation88: a.conversation(input),
      Conversation89: a.conversation(input),
      Conversation90: a.conversation(input),
      Conversation91: a.conversation(input),
      Conversation92: a.conversation(input),
      Conversation93: a.conversation(input),
      Conversation94: a.conversation(input),
      Conversation95: a.conversation(input),
      Conversation96: a.conversation(input),
      Conversation97: a.conversation(input),
      Conversation98: a.conversation(input),
      Conversation99: a.conversation(input),
    })
    .authorization((allow) => allow.publicApiKey());

  type _ = ClientSchema<typeof s>;
}).types([3159, 'instantiations']);
