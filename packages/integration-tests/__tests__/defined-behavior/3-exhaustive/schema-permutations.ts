import { a, ClientSchema } from '@aws-amplify/data-schema';
import { buildAmplifyConfig } from '../../utils';
import { AllowModifier } from '@aws-amplify/data-schema/internals';

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
          .authorization((allow) => allow.publicApiKey());
        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    }
  });
});

// how can we do this better to ensure we've got full coverage over auth graphql generation?
describe('auth rules', () => {
  test.each([
    ['owner()', (allow: AllowModifier) => allow.owner()],
    [
      '.ownerDefinedIn()',
      (allow: AllowModifier) => allow.ownerDefinedIn('field'),
    ],
    [
      'allow.ownerDefinedIn().to()',
      (allow: AllowModifier) =>
        allow.ownerDefinedIn('field').to(['create', 'delete']),
    ],
    [
      'owner(userpool).inField().to()',
      (allow: AllowModifier) => allow.owner('userPools').to(['create', 'list']),
    ],
  ])(
    'given auth rule builder %p, generates schema with expected auth rule',
    (_, ruleBuilderCallback) => {
      const schema = a.schema({
        Model: a
          .model({
            field: a.string(),
          })
          .authorization(ruleBuilderCallback as any),
      });

      const graphql = schema.transform().schema;

      expect(graphql).toMatchSnapshot();
    },
  );
});
