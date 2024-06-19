import { readdir, rm } from 'fs/promises';
import path from 'path';

/**
 * Deletes all changeset files
 * Used by commit-reverter script
 */
export const deleteChangesets = async () => {
  const changesetDir = path.join(process.cwd(), '.changeset');
  const files = await readdir(changesetDir);

  for (const file of files) {
    if (file.endsWith('.md')) {
      await rm(path.join(changesetDir, file));
    }
  }
};
