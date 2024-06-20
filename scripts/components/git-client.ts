import { $ as chainableExeca } from 'execa';
import { EOL } from 'os';

const RELEASE_COMMIT_MESSAGE = 'release: publish [ci skip]';
const REPO_DEFAULT_BRANCH = 'main';

/**
 * Client for programmatically  interacting with the local git cli
 */
export class GitClient {
  private isConfigured = false;

  /**
   * execaCommand that allows us to capture stdout
   *
   * Template string parameters are escaped automatically by execa. For details:
   * https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
   */
  private readonly exec;

  /**
   * execaCommand that pipes buffers to process buffers
   *
   * Template string parameters are escaped automatically by execa. For details:
   * https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
   */
  private readonly execWithIO;

  /**
   * Initialize with an optional directory to operate in.
   * Defaults to the process cwd.
   */
  constructor(cwd?: string) {
    // Amongst other things, `chainableExeca` escapes of template literal parameters
    // for us. If swapping deps/mechanisms, that escaping must be re-reimplemented.
    // See: https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
    this.exec = chainableExeca({ cwd });
    this.execWithIO = this.exec({ stdio: 'inherit' });
  }

  /**
   * Throws if there are uncommitted changes in the repo
   */
  ensureWorkingTreeIsClean = async () => {
    const { stdout } = await this.exec`git status --porcelain`;
    const isDirty = stdout.trim();
    if (isDirty) {
      throw new Error(
        'Dirty working tree detected. Commit or stash changes to continue.',
      );
    }
  };

  getCurrentBranch = async () => {
    const { stdout: currentBranch } = await this
      .exec`git branch --show-current`;
    return currentBranch;
  };

  /**
   * Gets the names of the files that were modified between startRef and endRef
   * endRef defaults to HEAD
   */
  getChangedFiles = async (startRef: string, endRef: string = 'HEAD') => {
    const { stdout: filenameDiffOutput } = await this
      .exec`git --no-pager diff --name-only ${startRef} ${endRef}`;
    return filenameDiffOutput.toString().split(EOL);
  };

  /**
   * Switches to branchName. Creates the branch if it does not exist.
   */
  switchToBranch = async (branchName: string) => {
    const { stdout: branchResult } = await this
      .exec`git branch -l ${branchName}`;
    const branchExists = branchResult.trim().length > 0;
    if (branchExists) {
      await this.execWithIO`git switch ${branchName}`;
    } else {
      await this.execWithIO`git switch -c ${branchName}`;
    }
  };

  /**
   * Stages and commits all current changes
   */
  commitAllChanges = async (message: string) => {
    await this.configure();
    await this.execWithIO`git add .`;
    await this.execWithIO`git commit --message ${message} --allow-empty`;
  };

  /**
   * Push to the remote
   */
  push = async ({ force }: { force: boolean } = { force: false }) => {
    await this.configure();

    const currentBranch = await this.getCurrentBranch();

    if (currentBranch === REPO_DEFAULT_BRANCH) {
      throw new Error(
        `Direct push to ${REPO_DEFAULT_BRANCH} is prohibited. Push to a different remote branch then open a PR.`,
      );
    }

    await this.execWithIO`git push ${force ? '--force' : ''}`;
  };

  fetchTags = async () => {
    await this.execWithIO`git fetch --tags`;
  };

  checkout = async (ref: string, paths: string[] = []) => {
    const additionalArgs = paths.length > 0 ? ['--', ...paths] : [];
    await this.execWithIO`git checkout ${ref} ${additionalArgs}`;
  };

  status = async () => {
    await this.execWithIO`git status`;
  };

  /**
   * Returns a list of tags that point to the given commit
   */
  getTagsAtCommit = async (commitHash: string) => {
    const { stdout: tagsString } = await this
      .exec`git tag --points-at ${commitHash}`;
    return tagsString.split(EOL).filter((line) => line.trim().length > 0);
  };

  /**
   * Reverts all commits after given commitHash. commitHash itself does not get reverted
   *
   * @returns array of commit hashes and messages that were reverted
   */
  revertToCommit = async (commitHash: string) => {
    const revertedCommits: { hash: string; message: string }[] = [];

    // Get the list of all commits after the provided commit hash
    const { stdout: commits } = await this
      .exec`git rev-list ${commitHash}..HEAD`;

    if (!commits) {
      throw new Error('No commits found for provided hash');
    }

    const commitHashesToRevert = await Promise.all(
      // Don't revert release commits; this would remove existing library versions from the Changelog
      commits.split('\n').filter(this.ignoreReleaseCommits),
    );

    for (const commit of commitHashesToRevert) {
      await this.exec`git revert --no-commit ${commit}`;
      const message = await this.getCommitMessageForHash(commit);
      revertedCommits.push({ hash: commit, message });
    }

    return revertedCommits;
  };

  getCommitMessageForHash = async (commitHash: string) => {
    const { stdout: message } = await this
      .exec`git log --format=%B -n 1 ${commitHash}`;

    return message;
  };

  /**
   * Used as a filter expression to ignore release commits
   * @returns boolean
   */
  private ignoreReleaseCommits = async (commitHash: string) => {
    const message = await this.getCommitMessageForHash(commitHash);

    return !message.includes(RELEASE_COMMIT_MESSAGE);
  };

  /**
   * Modify local git config to work in github actions.
   * A best effort is made to restore the config to its original state (to reduce annoyance when testing locally)
   */
  private configure = async () => {
    if (this.isConfigured) {
      return;
    }

    const userEmailKey = 'user.email';
    const userNameKey = 'user.name';
    const autoSetupRemoteKey = 'push.autoSetupRemote';

    const originalEmail = await this.getConfigSafe(userEmailKey);
    const originalName = await this.getConfigSafe(userNameKey);
    const originalAutoSetupRemote =
      await this.getConfigSafe(autoSetupRemoteKey);

    await this
      .exec`git config --replace-all ${userEmailKey} "github-actions[bot]@users.noreply.github.com"`;
    await this
      .exec`git config --replace-all ${userNameKey} "github-actions[bot]"`;
    await this.exec`git config --replace-all ${autoSetupRemoteKey} true`;

    this.registerCleanup(async () => {
      // reset config on exit
      if (originalEmail) {
        await this
          .exec`git config --replace-all ${userEmailKey} ${originalEmail}`;
      }
      if (originalName) {
        await this
          .exec`git config --replace-all ${userNameKey} ${originalName}`;
      }
      if (originalAutoSetupRemote) {
        await this
          .exec`git config --replace-all ${autoSetupRemoteKey} ${originalAutoSetupRemote}`;
      }
    });
    this.isConfigured = true;
  };

  private registerCleanup = (cleanupCallback: () => void | Promise<void>) => {
    // register the cleanup callback to common exit events
    // the type assertion is necessary because the types for this method don't accept async callbacks even though the event handlers can execute them
    const cleanupCallbackTypeAssertion = cleanupCallback as () => void;
    process.once('SIGINT', cleanupCallbackTypeAssertion);
    process.once('beforeExit', cleanupCallbackTypeAssertion);
    process.once('SIGTERM', cleanupCallbackTypeAssertion);
    process.once('uncaughtException', cleanupCallbackTypeAssertion);
    process.once('unhandledRejection', cleanupCallbackTypeAssertion);
  };

  private getConfigSafe = async (configKey: string) => {
    try {
      const { stdout } = await this.exec`git config ${configKey}`;
      return stdout;
    } catch {
      return undefined;
    }
  };
}
