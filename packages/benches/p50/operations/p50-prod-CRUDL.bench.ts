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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          website: a.url(),
          privateIdentifier: a
            .string()
            .required()
            .authorization([a.allow.owner()]),
          employees: a.hasMany('Employee'),
          stores: a.hasMany('Store'),
          warehouses: a.hasMany('Warehouse'),
          customers: a.manyToMany('Customer', {
            relationName: 'CompanyCustomers',
          }),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      // Model #2:
      Employee: a
        .model({
          employeeId: a.id().required(),
          name: a.string().required(),
          email: a.email().required().authorization([a.allow.owner()]),
          phone: a
            .phone()
            .required()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          website: a.url(),
          ssn: a.string().required().authorization([a.allow.owner()]),
          company: a.belongsTo('Company'),
          todos: a.hasMany('Todo'),
          posts: a.hasMany('Post'),
          tasks: a.hasMany('Task'),
        })
        .identifier(['employeeId', 'name'])
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      // Model #3:
      Salary: a
        .model({
          wage: a.float(),
          currency: a.string(),
        })
        .authorization([a.allow.specificGroups(['Admin', 'Leadership'])]),
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
          .authorization([a.allow.private().to(['read']), a.allow.owner()]),
        privacySetting: a.ref('PrivacySetting').required(),
        company: a.belongsTo('Company'),
        // hasMany w/out `belongsTo`:
        customers: a.hasMany('Customer'),
        warehouse: a.belongsTo('Warehouse'),
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
          .authorization([a.allow.private().to(['read']), a.allow.owner()]),
        privacySetting: a.ref('PrivacySetting'),
        company: a.belongsTo('Company'),
        stores: a.hasMany('Store'),
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
            .authorization([
              a.allow.specificGroup('Admin').to(['read']),
              a.allow.owner(),
            ]),
          // Customers can shop at many companies:
          companies: a.manyToMany('Company', {
            relationName: 'CompanyCustomers',
          }),
          orders: a.hasMany('Order'),
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
          employee: a.belongsTo('Employee'),
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
          employee: a.belongsTo('Employee'),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .authorization([a.allow.public().to(['read']), a.allow.owner()]),
      // Model #9:
      Task: a.model({
        name: a.string().required(),
        description: a.string(),
        privacySetting: a.ref('PrivacySetting').required(),
        priority: a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        employee: a.belongsTo('Employee'),
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
        customer: a.belongsTo('Customer'),
        items: a.hasMany('OrderItem'),
        totalPrice: a.float(),
        date: a.date(),
        lineItems: a.hasMany('LineItem'),
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
        product: a.hasOne('Product'),
        agreedUnitPrice: a.float(),
        quantity: a.integer().required(),
        fulfilledQuantity: a.integer(),
        fulfilledTime: a.time(),
        fulfilledDate: a.date(),
        order: a.belongsTo('Order'),
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
        lineItem: a.belongsTo('LineItem'),
        reviews: a.hasMany('Review'),
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
        .authorization([a.allow.groupDefinedIn('groups')]),
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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          website: a.url(),
          privateIdentifier: a
            .string()
            .required()
            .authorization([a.allow.owner()]),
          employees: a.hasMany('Employee2'),
          stores: a.hasMany('Store2'),
          warehouses: a.hasMany('Warehouse2'),
          customers: a.manyToMany('Customer2', {
            relationName: 'CompanyCustomers2',
          }),
          location: a.customType({
            lat: a.float().required(),
            long: a.float().required(),
          }),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      // Model #15:
      Employee2: a
        .model({
          employeeId: a.id().required(),
          name: a.string().required(),
          email: a.email().required().authorization([a.allow.owner()]),
          phone: a
            .phone()
            .required()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          website: a.url(),
          ssn: a.string().required().authorization([a.allow.owner()]),
          company: a.belongsTo('Company2'),
          todos: a.hasMany('Todo2'),
          posts: a.hasMany('Post2'),
          tasks: a.hasMany('Task2'),
        })
        .identifier(['employeeId', 'name'])
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      // Model #16:
      Salary2: a
        .model({
          wage: a.float(),
          currency: a.string(),
        })
        .authorization([a.allow.specificGroups(['Admin2', 'Leadership2'])]),
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
          .authorization([a.allow.private().to(['read']), a.allow.owner()]),
        privacySetting: a.ref('PrivacySetting').required(),
        company: a.belongsTo('Company2'),
        // hasMany w/out `belongsTo`:
        customers: a.hasMany('Customer2'),
        warehouse: a.belongsTo('Warehouse2'),
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
          .authorization([a.allow.private().to(['read']), a.allow.owner()]),
        privacySetting: a.ref('PrivacySetting2'),
        company: a.belongsTo('Company2'),
        stores: a.hasMany('Store2'),
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
            .authorization([
              a.allow.specificGroup('Admin2').to(['read']),
              a.allow.owner(),
            ]),
          // Customers can shop at many companies:
          companies: a.manyToMany('Company2', {
            relationName: 'CompanyCustomers2',
          }),
          orders: a.hasMany('Order2'),
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
          employee: a.belongsTo('Employee2'),
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
          employee: a.belongsTo('Employee2'),
          textField1: a.string(),
          textField2: a.string(),
          textField3: a.string(),
        })
        .authorization([a.allow.public().to(['read']), a.allow.owner()]),
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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          time: a
            .time()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          dateTime: a
            .datetime()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization([a.allow.private('iam').to(['read']), a.allow.owner()]),
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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          time: a
            .time()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          dateTime: a
            .datetime()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization([a.allow.private('iam').to(['read']), a.allow.owner()]),
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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          time: a
            .time()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          dateTime: a
            .datetime()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization([a.allow.private('iam').to(['read']), a.allow.owner()]),
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
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          time: a
            .time()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          dateTime: a
            .datetime()
            .authorization([a.allow.private().to(['read']), a.allow.owner()]),
          timestamp: a.timestamp(),
          json: a.json(),
          ipAddress: a.ipAddress(),
        })
        .authorization([a.allow.private('iam').to(['read']), a.allow.owner()]),
      // [Global authorization rule]
    })
    .authorization([a.allow.public()]);

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
    todoId: result.data.todoId,
    name: result.data.name,
  });

  await client.models.Todo.update({
    todoId: result.data.todoId,
    name: 'Updated Todo',
  });

  await client.models.Todo.delete({
    todoId: result.data.todoId,
    name: result.data.name,
  });

  await client.models.Todo.list();
}).types([14432637, 'instantiations']);
