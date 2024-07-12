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
  {
    label: 'Read Todo',
    action: async (client: any) => {
      const { errors: firstCreateErrors } = await client.models.Todo.create({
        content: 'todo1',
      });

      if (firstCreateErrors) {
        console.log('error on create:', firstCreateErrors);
        throw new Error(JSON.stringify(firstCreateErrors));
      }

      const { data: secondNewTodo, errors: secondCreateErrors } =
        await client.models.Todo.create({
          content: 'todo2',
        });

      if (secondCreateErrors) {
        console.log('error on create:', firstCreateErrors);
        throw new Error(JSON.stringify(secondCreateErrors));
      }

      // Get the first todo:
      const { data: getTodo, errors: readErrors } =
        await client.models.Todo.get({ id: secondNewTodo.id });

      if (readErrors) {
        console.log('error getting todo:', readErrors);
        throw new Error(JSON.stringify(readErrors));
      }

      return getTodo.content === 'todo2';
    },
  },
  {
    label: 'Update Todo',
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
