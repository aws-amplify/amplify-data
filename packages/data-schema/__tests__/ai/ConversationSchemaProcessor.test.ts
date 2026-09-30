// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { a } from '../../src/index';
import { defineFunctionStub } from '../utils';

describe('GraphQL string escaping in AI schema directives', () => {
  describe('@generation', () => {
    test('escapes double quotes in systemPrompt', () => {
      const schema = a.schema({
        Result: a.customType({ value: a.string() }),
        makeResult: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Always say "yes" or "no".',
          })
          .returns(a.ref('Result')),
      });

      const { schema: graphql } = schema.transform();

      expect(graphql).toContain('systemPrompt: "Always say \\"yes\\" or \\"no\\"."');
    });
  });

  describe('@conversation', () => {
    test('escapes double quotes in systemPrompt', () => {
      const schema = a.schema({
        ChatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'Say "hello" and "goodbye" to users.',
        }).authorization((allow) => allow.owner()),
      });

      const { schema: graphql } = schema.transform();

      expect(graphql).toContain('systemPrompt: "Say \\"hello\\" and \\"goodbye\\" to users."');
    });

    test('escapes double quotes in tool description', () => {
      const handler = defineFunctionStub({});
      const schema = a.schema({
        Profile: a.customType({ value: a.integer() }),
        infoQuery: a
          .query()
          .returns(a.ref('Profile'))
          .authorization((allow) => allow.publicApiKey())
          .handler(a.handler.function(handler)),

        ChatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'You are helpful.',
          tools: [
            a.ai.dataTool({
              query: a.ref('infoQuery'),
              name: 'infoQuery',
              description: 'Fetches "live" profile data.',
            }),
          ],
        }).authorization((allow) => allow.owner()),
      });

      const { schema: graphql } = schema.transform();

      expect(graphql).toContain('description: "Fetches \\"live\\" profile data."');
    });

    test('escapes backslashes in systemPrompt', () => {
      const schema = a.schema({
        ChatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: 'Use path C:\\\\docs for all outputs.',
        }).authorization((allow) => allow.owner()),
      });

      const { schema: graphql } = schema.transform();

      expect(graphql).toContain('systemPrompt: "Use path C:\\\\\\\\docs for all outputs."');
    });

    test('preserves newline escaping in multiline systemPrompt', () => {
      const schema = a.schema({
        ChatBot: a.conversation({
          aiModel: a.ai.model('Claude 3 Haiku'),
          systemPrompt: `You are helpful.
Respond in haiku.`,
        }).authorization((allow) => allow.owner()),
      });

      const { schema: graphql } = schema.transform();

      expect(graphql).toContain('systemPrompt: "You are helpful.\\nRespond in haiku."');
    });
  });
});
