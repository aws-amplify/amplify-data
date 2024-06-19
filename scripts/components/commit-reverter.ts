import { GitClient } from './git-client';
// import { GithubClient } from './github-client';
import { ChangesetClient } from './changeset-client';
import { deleteChangesets } from './delete-changesets';

export class CommitReverter {
  constructor(
    private readonly commitHash: string,
    private readonly gitClient: GitClient,
    // private readonly githubClient: GithubClient,
    private readonly changesetClient: ChangesetClient,
  ) {}

  createRevertPr = async () => {
    const revertBranch = `revert-to-${this.commitHash}`;

    await this.gitClient.switchToBranch(revertBranch);
    const revertedCommits = await this.gitClient.revertToCommit(
      this.commitHash,
    );

    // since we're only reverting the code change commits, this will restore changesets that were
    // included in the PR(s). We do not want to re-apply them when we merge the revert PR, so we
    // delete them here
    await deleteChangesets();

    const commitHashMessage = this.gitClient.getCommitMessageForHash(
      this.commitHash,
    );
    const revertCommitMessage = `Revert to ${commitHashMessage}`;

    // create revert changeset
    await this.changesetClient.patch(revertCommitMessage);

    await this.gitClient.commitAllChanges(revertCommitMessage);

    console.log('Reverted commits:', revertedCommits);
  };
}
