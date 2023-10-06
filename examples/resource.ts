import { a, ClientSchema } from '../packages/amplify-api-next';

const schema = a.schema({
  Todo: a.model({
    id: a.id().required(),
    title: a.string().required(),
    description: a.string(),
  }),
});

type Schema = ClientSchema<typeof schema>;
