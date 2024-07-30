import { deleteTestDirectory } from '../../utils/setup_test_directory';

const cleanup = async () => {
  const outputsPath = './amplify_outputs.json';
  await deleteTestDirectory(outputsPath);
  const amplifyPath = './.amplify';
  await deleteTestDirectory(amplifyPath);
};

await cleanup();
