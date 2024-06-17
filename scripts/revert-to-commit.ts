import { execa } from 'execa';

export async function revertToCommit(commitId: string) {
  try {
    // Get the current branch name
    const { stdout: currentBranch } = await execa('git', [
      'rev-parse',
      '--abbrev-ref',
      'HEAD',
    ]);

    console.log('On branch', currentBranch);

    // Create a new branch from the current branch
    const newBranchName = `revert-to-${commitId}`;
    await execa('git', ['checkout', '-b', newBranchName]);

    // Get the list of commits more recent than the provided commit id
    const { stdout: commits } = await execa('git', [
      'rev-list',
      `${commitId}..HEAD`,
    ]);
    const commitList = commits.split('\n').reverse();

    // Revert each commit individually
    for (const commit of commitList) {
      await execa('git', ['revert', '--no-commit', commit]);
    }

    // Commit the reverts
    await execa('git', ['commit', '-m', `Revert to commit ${commitId}`]);

    console.log(
      `Successfully reverted to commit ${commitId} on new branch ${newBranchName}`,
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const COMMIT_ID = 'dff71f501aae15622d4a5fb48ecd5da883725bd3';
revertToCommit(COMMIT_ID);
