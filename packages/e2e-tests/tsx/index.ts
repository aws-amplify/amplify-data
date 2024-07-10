export const testCases = [
  {
    label: 'Create Todo',
    action: async (client: any) => {
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

      return newTodo.content === 'test content';
    },
  },
];
