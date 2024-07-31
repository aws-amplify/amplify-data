import fs from 'fs/promises';
import path from 'path';
import { outputsFileName } from '../utils/';

/**
 * Util for retrieving / verifying the generated outputs from the sandbox deployment.
 */
export const getGeneratedOutputs = async (sandboxDir: string) => {
  /**
   * Path to the generated outputs file corresponding to the specific test.
   * Note: `fs` is run at the root of the project, therefore the path is starting
   * at the root.
   */
  const filePath = path.join(
    `./amplify-backends/${sandboxDir}/`,
    outputsFileName,
  );

  // Check that the file exists:
  try {
    const clientConfigStats = await fs.stat(filePath);

    // `true` if the file exists:
    const isFile = await clientConfigStats.isFile();

    if (!isFile) {
      throw new Error('Amplify outputs not generated');
    }

    /**
     * Relative import path since we are importing from the `__tests__` directory.
     */
    const relativeImportPath = path.join(
      `../amplify-backends/${sandboxDir}/`,
      outputsFileName,
    );

    // Import the generated outputs:
    const result = await import(relativeImportPath);
    const outputs = result.default;

    return { result: outputs };
  } catch (error) {
    return { errors: error };
  }
};
