import { configureAmplifyAndGenerateClient, cleanup } from './__tests__/utils';

export const testCases = [
  {
    label: 'Create Todo',
    action: async () => {
      const client = await configureAmplifyAndGenerateClient();
      const { data: newTodo, errors: createErrors } =
        await client.models.Todo.create({
          content: 'test content',
        });

      if (createErrors) {
        console.log('createErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!newTodo) {
        throw new Error('newTodo is undefined');
      }

      await cleanup(client);

      return newTodo.content === 'test content';
    },
  },
];
