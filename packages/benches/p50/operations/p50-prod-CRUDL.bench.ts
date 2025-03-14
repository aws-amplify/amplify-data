import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

/**
 * The following benchmarks are an extension of `p50.bench.ts`.
 * Here we perform CRUDL operations for a single model.
 */
bench('prod p50 CRUDL', async () => {
  const schema = a
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
          employees: a.hasMany('Employee', 'companyId'),
          stores: a.hasMany('Store', 'companyId'),
          warehouses: a.hasMany('Warehouse', 'companyId'),
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
          company: a.belongsTo('Company', 'employeeId'),
          todos: a.hasMany('Todo', 'employeeId'),
          posts: a.hasMany('Post', 'employeeId'),
          tasks: a.hasMany('Task', 'employeeId'),
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
        company: a.belongsTo('Company', 'companyId'),
        warehouseId: a.id(),
        warehouse: a.belongsTo('Warehouse', 'warehouseId'),
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
        company: a.belongsTo('Company', 'companyId'),
        stores: a.hasMany('Store', 'warehouseId'),
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
          orders: a.hasMany('Order', 'customerId'),
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
          employee: a.belongsTo('Employee', 'employeeId'),
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
          employee: a.belongsTo('Employee', 'employeeId'),
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
        employee: a.belongsTo('Employee', 'employeeId'),
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
        customer: a.belongsTo('Customer', 'customerId'),
        items: a.hasMany('OrderItem', 'orderId'),
        totalPrice: a.float(),
        date: a.date(),
        lineItems: a.hasMany('LineItem', 'orderId'),
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
        product: a.hasOne('Product', 'lineItemId'),
        agreedUnitPrice: a.float(),
        quantity: a.integer().required(),
        fulfilledQuantity: a.integer(),
        fulfilledTime: a.time(),
        fulfilledDate: a.date(),
        orderId: a.id(),
        order: a.belongsTo('Order', 'orderId'),
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
        lineItem: a.belongsTo('LineItem', 'lineItemId'),
        reviews: a.hasMany('Review', 'productId'),
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
          employees: a.hasMany('Employee2', 'company2Id'),
          stores: a.hasMany('Store2', 'company2Id'),
          warehouses: a.hasMany('Warehouse2', 'company2Id'),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      // Model #15:
      Employee2: a
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
          company: a.belongsTo('Company2', 'companyId'),
          todos: a.hasMany('Todo2', 'employee2Id'),
          posts: a.hasMany('Post2', 'employee2Id'),
          tasks: a.hasMany('Task2', 'employee2Id'),
        })
        .identifier(['employeeId', 'name'])
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      // Model #16:
      Salary2: a
        .model({
          wage: a.float(),
          currency: a.string(),
        })
        .authorization((allow) => [allow.groups(['Admin2', 'Leadership2'])]),
      // Model #17:
      Store2: a.model({
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
        company: a.belongsTo('Company2', 'companyId'),
        warehouseId: a.id(),
        warehouse: a.belongsTo('Warehouse2', 'warehouseId'),
      }),
      // Model #18:
      Warehouse2: a.model({
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
        privacySetting: a.ref('PrivacySetting2'),
        companyId: a.id(),
        company: a.belongsTo('Company2', 'companyId'),
        stores: a.hasMany('Store2', 'warehouse2Id'),
        textField1: a.string(),
      }),
      // Model #19:
      Customer2: a
        .model({
          customerId: a.id().required(),
          name: a.string().required(),
          profileImgSrc: a.url(),
          privacySetting: a.ref('PrivacySetting').required(),
          phone: a
            .phone()
            .required()
            .authorization((allow) => [
              allow.group('Admin2').to(['read']),
              allow.owner(),
            ]),
          orders: a.hasMany('Order2', 'customer2Id'),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .identifier(['customerId', 'name']),
      // Model #20:
      Todo2: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employee2Id: a.id(),
          employee: a.belongsTo('Employee2', 'employee2Id'),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
          textField4: a.string(),
        })
        .identifier(['todoId', 'name']),
      // Model #21:
      Post2: a
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
          employee2Id: a.id(),
          employee: a.belongsTo('Employee2', 'employee2Id'),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['read']),
          allow.owner(),
        ]),
      // Model #22:
      Model22: a
        .model({
          id: a.id().required(),
          description: a.string().required(),
          url: a.url().required(),
          integer: a.integer().required(),
          float: a.float().required(),
          boolean: a.boolean().required(),
          date: a
            .date()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          time: a
            .time()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          dateTime: a
            .datetime()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization((allow) => [
          allow.authenticated('identityPool').to(['read']),
          allow.owner(),
        ]),
      // Model #23:
      Model23: a
        .model({
          id: a.id().required(),
          description: a.string().required(),
          url: a.url().required(),
          integer: a.integer().required(),
          float: a.float().required(),
          boolean: a.boolean().required(),
          date: a
            .date()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          time: a
            .time()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          dateTime: a
            .datetime()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization((allow) => [
          allow.authenticated('identityPool').to(['read']),
          allow.owner(),
        ]),
      // Model #24:
      Model24: a
        .model({
          id: a.id().required(),
          description: a.string().required(),
          url: a.url().required(),
          integer: a.integer().required(),
          float: a.float().required(),
          boolean: a.boolean().required(),
          date: a
            .date()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          time: a
            .time()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          dateTime: a
            .datetime()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization((allow) => [
          allow.authenticated('identityPool').to(['read']),
          allow.owner(),
        ]),
      // Model #25:
      Model25: a
        .model({
          id: a.id().required(),
          description: a.string().required(),
          url: a.url().required(),
          integer: a.integer().required(),
          float: a.float().required(),
          boolean: a.boolean().required(),
          date: a
            .date()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          time: a
            .time()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          dateTime: a
            .datetime()
            .authorization((allow) => [
              allow.authenticated().to(['read']),
              allow.owner(),
            ]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization((allow) => [
          allow.authenticated('identityPool').to(['read']),
          allow.owner(),
        ]),
      // [Global authorization rule]
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  const result = await client.models.Todo.create({
    todoId: '123',
    name: 'New Todo',
  });

  await client.models.Todo.get({
    todoId: result.data!.todoId,
    name: result.data!.name,
  });

  await client.models.Todo.update({
    todoId: result.data!.todoId,
    name: 'Updated Todo',
  });

  await client.models.Todo.delete({
    todoId: result.data!.todoId,
    name: result.data!.name,
  });

  await client.models.Todo.list();
}).types([692058, 'instantiations']);
