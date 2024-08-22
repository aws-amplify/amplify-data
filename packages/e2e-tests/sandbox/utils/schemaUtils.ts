import fs from 'fs';

/**
 * Util for updating a test schema.
 * Useful for issue repro that involves reproducing errors related to schema
 * changes.
 */
export const updateSchema = (
  pathToNewSchema: string,
  pathToOriginSchema: string,
) => {
  fs.readFile(pathToNewSchema, (readError: any, data: any) => {
    if (readError) {
      console.error('Cannot read origin schema:', readError);
      return;
    }

    fs.writeFile(pathToOriginSchema, data, (writeError) => {
      if (writeError) {
        console.error('Error writing new schema:', writeError);
      } else {
        console.log('Successfully updated schema.');
      }
    });
  });
};
