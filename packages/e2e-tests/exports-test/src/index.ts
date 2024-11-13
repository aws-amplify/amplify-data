import { a, defineFunction } from '@aws-amplify/backend';
import { configure } from '@aws-amplify/data-schema/internals';

const defFunc = defineFunction({
  entry: './handlers/test-handler.ts',
});

export function buildMutation() {
  return a
    .mutation()
    .arguments({
      input: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(defFunc))
    .authorization((allow) => [allow.authenticated()]);
}

export function buildQueryRequiredInputJsonOutput() {
  return a.schema({
    testQuery: a
    .query()
    .arguments({
      input: a.string().required(),
    })
    .returns(a.json())
    .handler(a.handler.function(defFunc))
  }).authorization((allow) => [allow.resource(defFunc)]);
}

export function buildQueryWithSDataAccess() {
  return a
    .query()
    .arguments({
      input: a.string().required(),
    })
    .returns(a.json())
    .handler(a.handler.function(defFunc));
}

export function buildDefaultSchema() {
  return a.schema({
    Todo: a
      .model({
        content: a.string(),
      })
      .authorization((allow) => [allow.guest()]),
  });
}

const fakeSecret = () => ({}) as any;
const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

export function buildCombineSchema() {
  const schemaA = a.schema({
    Todo: a
      .model({
        content: a.string(),
      })
      .authorization((allow) => [allow.guest()]),
  });
  const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
    post: a
      .model({
        id: a.string().required(),
        title: a.string(),
        author: a.string(),
      })
      .identifier(['id']),
  });
  return a.combine([schemaA, sqlSchema])
}

export function buildComplicatedSchema() {
  return a
    .schema({
      PrivacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
      FulfillmentStatus: a.enum(['PENDING', 'SHIPPED', 'DELIVERED']),
      Company: a
        .model({
          id: a.id().required(),
          name: a.string().required(),
          phone: a
            .phone()
            .required()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          website: a.url(),
          privateIdentifier: a
            .string()
            .required()
            .authorization((allow) => allow.owner()),
          employees: a.hasMany('Employee', ['companyId']),
          stores: a.hasMany('Store', ['companyId']),
          warehouses: a.hasMany('Warehouse', ['companyId']),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      // Model #2:
      Employee: a
        .model({
          employeeId: a.id().required(),
          name: a.string().required(),
          email: a
            .email()
            .required()
            .authorization((allow) => allow.owner()),
          phone: a
            .phone()
            .required()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          website: a.url(),
          ssn: a
            .string()
            .required()
            .authorization((allow) => allow.owner()),
          companyId: a.id(),
          company: a.belongsTo('Company', ['companyId']),
          todos: a.hasMany('Todo', ['employeeId']),
          posts: a.hasMany('Post', ['employeeId']),
          tasks: a.hasMany('Task', ['employeeId']),
        })
        .identifier(['employeeId', 'name'])
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      // Model #3:
      Salary: a
        .model({
          wage: a.float(),
          currency: a.string(),
        })
        .authorization((allow) => [allow.groups(['Admin', 'Leadership'])]),
      // Model #4:
      Store: a.model({
        id: a.id().required(),
        name: a.string().required(),
        description: a.string(),
        storeImgSrc: a.url(),
        location: a.customType({
          lat: a.float().required(),
          long: a.float().required(),
        }),
        phone: a
          .phone()
          .required()
          .authorization((allow) => [
            allow.authenticated().to(['read']),
            allow.owner(),
          ]),
        privacySetting: a.ref('PrivacySetting').required(),
        companyId: a.id(),
        company: a.belongsTo('Company', ['companyId']),
        warehouse: a.belongsTo('Warehouse', ['storeId']),
      }),
      // Model #5:
      Warehouse: a.model({
        id: a.id().required(),
        name: a.string().required(),
        description: a.string(),
        warehouseImgSrc: a.url(),
        location: a.customType({
          lat: a.float().required(),
          long: a.float().required(),
        }),
        phone: a
          .phone()
          .required()
          .authorization((allow) => [
            allow.authenticated().to(['read']),
            allow.owner(),
          ]),
        privacySetting: a.ref('PrivacySetting'),
        companyId: a.id(),
        company: a.belongsTo('Company', ['companyId']),
        storeId: a.id(),
        stores: a.hasMany('Store', ['storeId']),
        textField1: a.string(),
      }),
      // Model #6:
      Customer: a
        .model({
          customerId: a.id().required(),
          name: a.string().required(),
          profileImgSrc: a.url(),
          privacySetting: a.ref('PrivacySetting').required(),
          phone: a
            .phone()
            .required()
            .authorization((allow) => [
              allow.group('Admin').to(['read']),
              allow.owner(),
            ]),
          orders: a.hasMany('Order', ['customerId']),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .identifier(['customerId', 'name']),
      // Model #7:
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', ['employeeId']),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
          textField4: a.string(),
        })
        .identifier(['todoId', 'name']),
      // Model #8:
      Post: a
        .model({
          name: a.string().default('My new Post'),
          notes: a.string().array(),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
          lastViewedDate: a.date(),
          lastViewedTime: a.time(),
          privacySetting: a.ref('PrivacySetting').required(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', ['employeeId']),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['read']),
          allow.owner(),
        ]),
      // Model #9:
      Task: a.model({
        name: a.string().required(),
        description: a.string(),
        privacySetting: a.ref('PrivacySetting').required(),
        priority: a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        employeeId: a.id(),
        employee: a.belongsTo('Employee', ['employeeId']),
        textField1: a.string(),
        textField2: a.string(),
        textField3: a.string(),
        textField4: a.string(),
        textField5: a.string(),
      }),
      // Model #10:
      Order: a.model({
        id: a.id().required(),
        status: a.ref('FulfillmentStatus').required(),
        customerId: a.id(),
        customer: a.belongsTo('Customer', ['customerId']),
        totalPrice: a.float(),
        date: a.date(),
        lineItems: a.hasMany('LineItem', ['orderId']),
        textField1: a.string(),
        textField2: a.string(),
        textField3: a.string(),
        textField4: a.string(),
        textField5: a.string(),
        textField6: a.string(),
        textField7: a.string(),
        textField8: a.string(),
        textField9: a.string(),
        textField10: a.string(),
      }),
      // Model #11:
      LineItem: a.model({
        id: a.id().required(),
        product: a.hasOne('Product', ['lineItemId']),
        agreedUnitPrice: a.float(),
        quantity: a.integer().required(),
        fulfilledQuantity: a.integer(),
        fulfilledTime: a.time(),
        fulfilledDate: a.date(),
        orderId: a.id(),
        order: a.belongsTo('Order', ['orderId']),
        textField1: a.string(),
        textField2: a.string(),
      }),
      // Model #12:
      Product: a.model({
        id: a.id().required(),
        name: a.string().required(),
        description: a.string().required(),
        msrpUSD: a.float(),
        productImgSrc: a.url(),
        inventoryCount: a.integer(),
        lineItemId: a.id(),
        lineItem: a.belongsTo('LineItem', ['lineItemId']),
        reviews: a.hasMany('Review', ['productId']),
        textField1: a.string(),
        textField2: a.string(),
        textField3: a.string(),
        textField4: a.string(),
        textField5: a.string(),
        textField6: a.string(),
        textField7: a.string(),
        textField8: a.string(),
        textField9: a.string(),
        textField10: a.string(),
        textField11: a.string(),
        textField12: a.string(),
        textField13: a.string(),
        textField14: a.string(),
        textField15: a.string(),
      }),
      Review: a.model({
        content: a.string().required(),
        rating: a.integer().required(),
        productId: a.id(),
        product: a.belongsTo('Product', ['productId']),
      }),
      // Model #13:
      CustomerPost: a
        .model({
          title: a.string(),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
          textField4: a.string(),
          textField5: a.string(),
          textField6: a.string(),
          textField7: a.string(),
          textField8: a.string(),
          groups: a.string().array(),
        })
        .authorization((allow) => [allow.groupDefinedIn('groups')]),
      /**
       * With the exception of the last 4 unconnected models, the following models
       * are duplicates of the above models, with different names.
       */
      // Model #14:
      Company2: a
        .model({
          id: a.id().required(),
          name: a.string().required(),
          phone: a
            .phone()
            .required()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          website: a.url(),
          privateIdentifier: a
            .string()
            .required()
            .authorization((allow) => allow.owner()),
          employees: a.hasMany('Employee2', ['company2Id']),
          stores: a.hasMany('Store2', ['company2Id']),
          warehouses: a.hasMany('Warehouse2', ['company2Id']),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
    })
    .authorization((allow) => [allow.guest()]);
}
