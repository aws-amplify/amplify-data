import { a, ClientSchema } from '@aws-amplify/data-schema';
import { buildAmplifyConfig } from '../../utils';

const fieldTypes = [
  'boolean',
  'date',
  'datetime',
  'email',
  'float',
  'id',
  'integer',
  'ipAddress',
  'json',
  'phone',
  'string',
  'time',
  'timestamp',
  'url',
] as const;

// non-primitive field types
// enum
// customType

describe('primitive field types', () => {
  describe('generate expected graphql', () => {
    for (const fieldType of fieldTypes) {
      test(fieldType, async () => {
        const schema = a
          .schema({
            Model: a.model({
              optionalField: a[fieldType](),
              requiredField: a[fieldType]().required(),
            }),
          })
          .authorization([a.allow.public()]);
        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    }
  });
});

// how can we do this better to ensure we've got full coverage over auth graphql generation?
describe('auth rules', () => {
  for (const [name, rule] of Object.entries({
    'owner()': a.allow.owner(),
    'owner().inField()': a.allow.owner().inField('field'),
    'owner().inField().to()': a.allow
      .owner()
      .inField('field')
      .to(['create', 'delete']),
    'owner(userpool).inField().to().': a.allow
      .owner('userPools')
      .to(['create', 'list']),
  })) {
    test(name, () => {
      const schema = a.schema({
        Model: a
          .model({
            field: a.string(),
          })
          .authorization([rule]),
      });
      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });
  }
});
