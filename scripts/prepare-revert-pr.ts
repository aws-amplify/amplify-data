import { getInput } from '@actions/core';
import { CommitReverter } from './components/commit-reverter';
import { GitClient } from './components/git-client';
import { GithubClient } from './components/github-client';
import { ChangesetClient } from './components/changeset-client';

const commitHash = getInput('commitHash', { required: true });

const commitReverter = new CommitReverter(
  commitHash,
  new GitClient(),
  new GithubClient(),
  new ChangesetClient(),
);

(async () => {
  try {
    await commitReverter.createRevertPr();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
