import { a, ClientSchema } from '../../src/index';
import type {
  ClientExtensions,
  ModelTypes,
  ModelTypesClient,
} from '../../src/runtime/index';
import { Expect, Equal } from '@aws-amplify/data-schema-types';

describe('ModelTypesClient', () => {
  const schema = a
    .schema({
      Todo: a
        .model({
          content: a.string(),
          status: a.string(),
        })
        .secondaryIndexes((index) => [index('status')]),
      Note: a
        .model({
          body: a.string().required(),
        })
        .disableOperations(['delete']),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  const client = {} as ClientExtensions<Schema>;

  test('can annotate a variable with the type of a single model client', async () => {
    const todo: ModelTypesClient<Schema['Todo']> = client.models.Todo;

    const { data } = await todo.get({ id: 'some-id' });
    const { data: expected } = await client.models.Todo.get({ id: 'some-id' });

    type _test = Expect<Equal<typeof data, typeof expected>>;
  });

  test('is interchangeable with the model client from the generated client', () => {
    const todo: ModelTypesClient<Schema['Todo']> = client.models.Todo;
    const _todoBack: typeof client.models.Todo = todo;

    const note: ModelTypesClient<Schema['Note']> = client.models.Note;
    const _noteBack: ModelTypes<Schema>['Note'] = note;
  });

  test('includes secondary index query methods and omits disabled operations', () => {
    const todo: ModelTypesClient<Schema['Todo']> = client.models.Todo;
    todo.listTodoByStatus({ status: 'done' });

    const note: ModelTypesClient<Schema['Note']> = client.models.Note;
    // @ts-expect-error delete is disabled on Note
    note.delete({ id: 'some-id' });
  });

  test('rejects a client for a different model', () => {
    // @ts-expect-error Note client is not assignable to Todo client
    const _todo: ModelTypesClient<Schema['Todo']> = client.models.Note;
  });
});
