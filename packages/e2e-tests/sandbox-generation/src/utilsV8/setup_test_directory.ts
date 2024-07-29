import { existsSync } from 'fs';
import fs from 'fs/promises';
/**
 * Delete a test directory or file:
 */
export const deleteTestDirectory = async (pathName: string | URL) => {
  console.log('deleting:', pathName);
  if (existsSync(pathName)) {
    await fs.rm(pathName, { recursive: true, force: true });
  }
};
