import { getInput } from '@actions/core';
import { GithubClient } from './components/github-client';
import { GitClient } from './components/git-client';
import { NpmClient, loadNpmTokenFromEnvVar } from './components/npm-client';
import { ReleaseDeprecator } from './components/release-deprecator';
import { DistTagMover } from './components/dist-tag-mover';

const deprecationMessage = getInput('deprecationMessage', {
  required: true,
});
const searchForReleaseStartingFrom = getInput('searchForReleaseStartingFrom', {
  required: true,
});
const useNpmRegistry =
  getInput('useNpmRegistry', { required: true }) === 'true';

if (useNpmRegistry) {
  console.log(
    'useNpmRegistry is TRUE. This run will update package metadata on the public npm package registry.',
  );
} else {
  console.log(
    'useNpmRegistry is FALSE. This run will update package metadata on a local npm proxy. No public changes will be made.',
  );
}

const npmClient = new NpmClient(
  useNpmRegistry ? loadNpmTokenFromEnvVar() : null,
);

(async () => {
  await npmClient.configureNpmRc();

  const releaseDeprecator = new ReleaseDeprecator(
    searchForReleaseStartingFrom,
    deprecationMessage,
    new GithubClient(),
    new GitClient(),
    npmClient,
    new DistTagMover(npmClient),
  );

  try {
    await releaseDeprecator.deprecateRelease();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
