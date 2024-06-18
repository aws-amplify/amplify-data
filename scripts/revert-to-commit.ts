import { execa } from 'execa';
import { promises as fs } from 'fs';
import path from 'path';

const RELEASE_COMMIT_MESSAGE = 'release: publish [ci skip]';

const ignoreReleaseCommits = async (commitId: string) => {
  const { stdout: message } = await execa('git', [
    'log',
    '--format=%B',
    '-n',
    '1',
    commitId,
  ]);
  // Don't revert release commits; this would remove existing library versions from the Changelog
  return !message.includes(RELEASE_COMMIT_MESSAGE);
};

const deleteRevertedChangesets = async () => {
  const changesetDir = path.join(__dirname, '.changeset');
  const files = await fs.readdir(changesetDir);

  for (const file of files) {
    if (file.endsWith('.md')) {
      await fs.rm(path.join(changesetDir, file));
    }
  }
};

export async function revertToCommit(commitId: string) {
  try {
    // Create a new branch from the current branch
    const newBranchName = `revert-to-${commitId}`;
    await execa('git', ['checkout', '-b', newBranchName]);

    // Get the list of commits more recent than the provided commit id
    const { stdout: commits } = await execa('git', [
      'rev-list',
      `${commitId}..HEAD`,
    ]);

    const commitList = await Promise.all(
      commits.split('\n').reverse().filter(ignoreReleaseCommits),
    );

    // Revert each commit individually
    for (const commit of commitList) {
      await execa('git', ['revert', '--no-commit', commit]);
    }

    await deleteRevertedChangesets();

    // Commit the reverts
    await execa('git', ['commit', '-m', `Revert to commit ${commitId}`]);

    console.log(
      `Successfully reverted to commit ${commitId} on new branch ${newBranchName}`,
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const COMMIT_ID = '702d2160e61b6a50701d92e83821504c9c63f788';
revertToCommit(COMMIT_ID);
