export default {
  auth: {
    user_pool_id: 'us-west-1_etc',
    aws_region: 'us-west-1',
    user_pool_client_id: 'some_pool_client_id',
    identity_pool_id: 'us-west-1:etc',
    standard_required_attributes: ['email'],
    username_attributes: ['email'],
    user_verification_types: ['email'],
    password_policy: {
      min_length: 8,
      require_numbers: true,
      require_lowercase: true,
      require_uppercase: true,
      require_symbols: true,
    },
    unauthenticated_identities_enabled: true,
  },
  data: {
    url: 'http://localhost/graphql',
    aws_region: 'us-west-1',
    api_key: 'SOMEAPIKEY',
    default_authorization_type: 'API_KEY',
    authorization_types: ['AMAZON_COGNITO_USER_POOLS', 'AWS_IAM'],
    model_introspection: {
      version: 1,
      models: {
        Cart: {
          name: 'Cart',
          fields: {
            id: {
              name: 'id',
              isArray: false,
              type: 'ID',
              isRequired: true,
              attributes: [],
            },
            items: {
              name: 'items',
              isArray: true,
              type: 'String',
              isRequired: true,
              attributes: [],
              isArrayNullable: true,
            },
            customerId: {
              name: 'customerId',
              isArray: false,
              type: 'ID',
              isRequired: false,
              attributes: [],
            },
            customer: {
              name: 'customer',
              isArray: false,
              type: {
                model: 'Customer',
              },
              isRequired: false,
              attributes: [],
              association: {
                connectionType: 'BELONGS_TO',
                targetNames: ['customerId'],
              },
            },
            createdAt: {
              name: 'createdAt',
              isArray: false,
              type: 'AWSDateTime',
              isRequired: false,
              attributes: [],
              isReadOnly: true,
            },
            updatedAt: {
              name: 'updatedAt',
              isArray: false,
              type: 'AWSDateTime',
              isRequired: false,
              attributes: [],
              isReadOnly: true,
            },
          },
          syncable: true,
          pluralName: 'Carts',
          attributes: [
            {
              type: 'model',
              properties: {},
            },
            {
              type: 'auth',
              properties: {
                rules: [
                  {
                    allow: 'public',
                    provider: 'apiKey',
                    operations: ['create', 'update', 'delete', 'read'],
                  },
                ],
              },
            },
          ],
          primaryKeyInfo: {
            isCustomPrimaryKey: false,
            primaryKeyFieldName: 'id',
            sortKeyFieldNames: [],
          },
        },
        Customer: {
          name: 'Customer',
          fields: {
            id: {
              name: 'id',
              isArray: false,
              type: 'ID',
              isRequired: true,
              attributes: [],
            },
            name: {
              name: 'name',
              isArray: false,
              type: 'String',
              isRequired: false,
              attributes: [],
            },
            activeCart: {
              name: 'activeCart',
              isArray: false,
              type: {
                model: 'Cart',
              },
              isRequired: false,
              attributes: [],
              association: {
                connectionType: 'HAS_ONE',
                associatedWith: ['customerId'],
                targetNames: [],
              },
            },
            createdAt: {
              name: 'createdAt',
              isArray: false,
              type: 'AWSDateTime',
              isRequired: false,
              attributes: [],
              isReadOnly: true,
            },
            updatedAt: {
              name: 'updatedAt',
              isArray: false,
              type: 'AWSDateTime',
              isRequired: false,
              attributes: [],
              isReadOnly: true,
            },
          },
          syncable: true,
          pluralName: 'Customers',
          attributes: [
            {
              type: 'model',
              properties: {},
            },
            {
              type: 'auth',
              properties: {
                rules: [
                  {
                    allow: 'public',
                    provider: 'apiKey',
                    operations: ['create', 'update', 'delete', 'read'],
                  },
                ],
              },
            },
          ],
          primaryKeyInfo: {
            isCustomPrimaryKey: false,
            primaryKeyFieldName: 'id',
            sortKeyFieldNames: [],
          },
        },
      },
      enums: {},
      nonModels: {},
    },
  },
  version: '1',
} as const;
