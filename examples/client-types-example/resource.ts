import { a, ClientSchema } from '@aws-amplify/data-schema';
import { __modelMeta__ } from '@aws-amplify/data-schema-types';
import { configure } from '@aws-amplify/data-schema/internals';

const schema = configure({
  database: { engine: 'mysql', connectionUri: {} as any },
}).schema({
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

const s2 = schema.addMutations({
  myMutation: a.mutation().returns(a.ref('Post')),
});

export type Schema = ClientSchema<typeof s2>;
