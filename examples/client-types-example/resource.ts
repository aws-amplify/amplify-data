import { a, ClientSchema } from '@aws-amplify/data-schema';
import { __modelMeta__ } from '@aws-amplify/data-schema-types';
import { configure } from '@aws-amplify/data-schema/internals';

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
  test: a
    .query()
    .arguments({
      id: a.id(),
    })
    .returns(a.ref('Post'))
    .handler([a.handler.inlineSql('test')]),
});
// TODO Start here
const x = a.handler.inlineSql('test');
export type Schema = ClientSchema<typeof schema>;
