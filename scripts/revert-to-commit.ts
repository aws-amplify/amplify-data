import { execa } from 'execa';

export async function revertToCommit(commitId: string) {
  try {
    // Create a new branch from the current branch
    const newBranchName = `revert-to-${commitId}`;
    await execa('git', ['checkout', '-b', newBranchName]);

    // Revert to specified commit and commit to branch
    await execa('git', ['revert', '--no-commit', `${commitId}..HEAD`]);
    await execa('git', ['commit', '-m', `Revert to commit ${commitId}`]);

    console.log(
      `Successfully reverted to commit ${commitId} on new branch ${newBranchName}`,
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const COMMIT_ID = '54b64f2424d7c1a2b5b7feb23c8453db0217d36d';
revertToCommit(COMMIT_ID);
