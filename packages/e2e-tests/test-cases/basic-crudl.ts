export const basicCRUDL = [
  {
    label: 'Create',
    action: async (client: any) => {
      const { data: newTodo, errors: createErrors } =
        await client.models.Todo.create({
          content: 'test create',
        });

      if (createErrors) {
        console.log('createErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!newTodo) {
        throw new Error('newTodo is undefined');
      }

      // TODO: better assertion:
      return newTodo.content === 'test create';
    },
  },
  {
    label: 'Read',
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

      // TODO: better assertion:
      return getTodo.content === 'todo2';
    },
  },
  {
    label: 'Update',
    action: async (client: any) => {
      const { data: originalTodo, errors: createErrors } =
        await client.models.Todo.create({
          content: 'original content',
        });

      if (createErrors) {
        console.log('createErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!originalTodo) {
        throw new Error('newTodo is undefined');
      }

      const { data: updatedTodo, errors: updateErrors } =
        await client.models.Todo.update({
          id: originalTodo.id,
          content: 'test content',
        });

      if (updateErrors) {
        console.log('updateErrors:', updateErrors);
        throw new Error(JSON.stringify(updateErrors));
      }

      // TODO: better assertion:
      return updatedTodo.content === 'test content';
    },
  },
  {
    label: 'Delete',
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

      const { data: deletedTodo, errors: deleteErrors } =
        await client.models.Todo.delete(newTodo);

      if (deleteErrors) {
        console.log('deleteErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      // TODO: better assertion:
      return deletedTodo.content === 'test content';
    },
  },
];
