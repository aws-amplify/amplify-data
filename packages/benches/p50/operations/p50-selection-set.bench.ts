import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const selectionSet = ['name'] as const;

bench('baseline', () => {}).types([0, 'instantiations']);

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
          email: a.email().authorization([a.allow.owner()]),
          phone: a.phone().authorization([a.allow.owner()]),
          website: a.url(),
          ssn: a.string().authorization([a.allow.owner()]),
          todos: a.hasMany('Todo'),
          posts: a.hasMany('Post'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employee: a.belongsTo('Employee'),
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
          employee: a.belongsTo('Employee'),
        })
        .authorization([a.allow.public().to(['read']), a.allow.owner()]),
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

  await client.models.Todo.get(
    { todoId: result.data.todoId, name: result.data.name },
    { selectionSet },
  );

  await client.models.Todo.update({
    todoId: result.data.todoId,
    name: 'Updated Todo',
  });

  await client.models.Todo.delete({
    todoId: result.data.todoId,
    name: result.data.name,
  });

  await client.models.Todo.list({ selectionSet });
}).types([3111497, 'instantiations']);
