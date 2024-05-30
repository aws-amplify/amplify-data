import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const selectionSet = ['name'] as const;

/**
 * The following benchmarks are an extension of `p50.bench.ts`.
 * Here we perform CRUDL operations for a single model.
 */
bench('p50 CRUDL', async () => {
  // const schema = helper();
  const schema = a
    .schema({
      Employee: a
        .model({
          name: a.string().required(),
          email: a.email().authorization((allow) => allow.owner()),
          phone: a.phone().authorization((allow) => allow.owner()),
          website: a.url(),
          ssn: a.string().authorization((allow) => allow.owner()),
          todos: a.hasMany('Todo', 'employeeId'),
          posts: a.hasMany('Post', 'employeeId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', 'employeeId'),
        })
        .identifier(['todoId', 'name']),
      Post: a
        .model({
          name: a.string().default('My new Post'),
          notes: a.string().array(),
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
          lastViewedDate: a.date(),
          lastViewedTime: a.time(),
          employeeId: a.id(),
          employee: a.belongsTo('Employee', 'employeeId'),
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['read']),
          allow.owner(),
        ]),
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

  await client.models.Todo.get(
    { todoId: result.data!.todoId, name: result.data!.name },
    { selectionSet },
  );

  await client.models.Todo.update({
    todoId: result.data!.todoId,
    name: 'Updated Todo',
  });

  await client.models.Todo.delete({
    todoId: result.data!.todoId,
    name: result.data!.name,
  });

  await client.models.Todo.list({ selectionSet });
}).types();
