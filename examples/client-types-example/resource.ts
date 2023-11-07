import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';
import { __modelMeta__ } from '@aws-amplify/amplify-api-next-types-alpha';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    description: a.string(),
    location: a.ref('Location').required(),
  }),

  Location: a.customType({
    lat: a.float(),
    long: a.float(),
  }),
});

export type Schema = ClientSchema<typeof schema>;
