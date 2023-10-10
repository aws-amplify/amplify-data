import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';

const schema = a.schema({
  Todo: a.model({
    title: a.string().required(),
    description: a.string(),
  }),
  // .identifier(['title']),
});

export type Schema = ClientSchema<typeof schema>;
