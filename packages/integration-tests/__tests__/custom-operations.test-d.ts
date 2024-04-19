import { ClientSchema, a } from '@aws-amplify/data-schema';
import { Equal, Expect } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

describe('CustomOperations', () => {
  const schema = a.schema({
    echo: a
      .query()
      .arguments({
        requiredField: a.string().required(),
        optionalField: a.string(),
      })
      .returns('something')
      .authorization([a.allow.public()])
      .handler(a.handler.function('echoHandler')),
  });

  type Schema = ClientSchema<typeof schema>;
  const client = generateClient<Schema>();

  test('the custom query input type matches the expected type', () => {
    type ResolvedQueryInputType = Parameters<typeof client.queries.echo>[0];

    type Expected = {
      optionalField?: string | null | undefined;
      requiredField: string;
    };

    type _ = Expect<Equal<ResolvedQueryInputType, Expected>>;
  });
});
