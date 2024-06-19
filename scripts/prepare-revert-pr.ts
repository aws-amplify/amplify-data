// import { getInput } from '@actions/core';
import { CommitReverter } from './components/commit-reverter';
import { GitClient } from './components/git-client';
// import { GithubClient } from './components/github-client';
import { ChangesetClient } from './components/changeset-client';

// const commitHash = getInput('commitHash', { required: true });

// TODO: for local testing; delete before merging
const COMMIT_HASH = '4b87662bea74d0357f4b2a91871bcbd39b40ec12';

const projectRoot = process.cwd();

const commitReverter = new CommitReverter(
  COMMIT_HASH,
  new GitClient(),
  // new GithubClient(),
  new ChangesetClient(projectRoot),
);

(async () => {
  try {
    await commitReverter.createRevertPr();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();

console.log('bad commit 1');
console.log('bad commit 2');
