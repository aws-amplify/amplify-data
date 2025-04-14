import { execa, execaCommand } from 'execa';

const VERDACCIO_PORT = 4873;
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const YARN_REGISTRY = 'https://registry.yarnpkg.com/';

/**
 * Kills the process that is listening on VERDACCIO_PORT
 * Resets npm registry config back to the npm registry
 *
 * reset the npm registry
 *
 * Template string parameters are escaped automatically by execa. For details:
 * https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
 */
await execa('npm', ['config', 'set', 'registry', NPM_REGISTRY]);
await execa('yarn', ['config', 'set', 'registry', YARN_REGISTRY]);

// returns the process id of the process listening on the specified port
let pid: number;
try {
  /*
   * Template string parameters are escaped automatically by execa. For details:
   * https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
   */
  const lsofResult = await execaCommand(
    `lsof -n -t -iTCP:${VERDACCIO_PORT} -sTCP:LISTEN`,
  );
  pid = Number.parseInt(lsofResult.stdout.toString());
} catch (err) {
  console.warn(
    'Could not determine npm proxy process id. Most likely the process has already been stopped.',
  );
  process.exit(0);
}
process.kill(pid);
