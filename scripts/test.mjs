import concurrently from 'concurrently';
import { parseArgs } from 'node:util';
import fsExtra from 'fs-extra';
import common from './common.mjs';
const { logError } = common;
const { pathExistsSync } = fsExtra;

const defaultTimeout = 5 * 60 * 1000; // 5 minutes

const FRAMEWORKS = {
  rollup: 'rollup',
  webpack: 'webpack',
};

const BUILD_TYPE = {
  dev: 'dev',
  prod: 'prod',
};

const frameworkPort = {
  [FRAMEWORKS.rollup]: '3000',
  [FRAMEWORKS.webpack]: '3000',
};

// Read arguments from process.argv, validate them, and assign defaults. Returns the parameter list.
const getParameters = () => {
  let {
    positionals: [framework, build],
  } = parseArgs({
    allowPositionals: true,
  });

  if (!framework || !FRAMEWORKS.hasOwnProperty(framework)) {
    logError(`Please enter a valid framework: ${[...Object.keys(FRAMEWORKS)]}`);
    process.exit(1);
  }

  if (
    !pathExistsSync(`packages/e2e-tests/${framework}`)
  ) {
    logError('Please enter a valid framework name');
    process.exit(1);
  }
  if (!build || !BUILD_TYPE.hasOwnProperty(build)) {
    build = 'dev';
  }
  return {
    framework,
    build
  };
};

// bash command for installing node_modules if it is not present
const npmInstall = (sampleDir) => {
  return pathExistsSync(`${sampleDir}/node_modules`)
    ? `echo "Skipping npm install"`
    : `npm --prefix ${sampleDir} install`;
};

const sampleDirectory = ({ framework }) => {
  return `packages/e2e-tests/${framework}`;
};

// bash command for serving sample on prod
const runAppOnProd = ({ framework}) => {
  const sampleDir = sampleDirectory({ framework });
  let distDir; // distribution directory
  if (framework === FRAMEWORKS.webpack) {
    distDir = `${sampleDir}/dist`;
  } else {
    logError(`unknown framework: ${framework}`);
  }
  const install = npmInstall(sampleDir);

  let buildCommand = 'build';

  const serveCommand = `serve -s ${distDir} -l ${frameworkPort[framework]}`;

  const command = [
    install,
    `npm --prefix ${sampleDir} run ${buildCommand}`,
    serveCommand,
  ]
    .filter(Boolean)
    .join(' && ');

  console.log('prod', command);

  return command;
};

const getDevStartCommand = ({ framework }) => {
  const startWithbackendCmd ='start';
  return startWithbackendCmd;
};

// bash command for serving sample on dev
const runAppOnDev = ({ framework}) => {
  const sampleDir = sampleDirectory({ framework });
  const install = npmInstall(sampleDir);
  const startScript = getDevStartCommand({ framework});
  const command = [
    install,
    `npm --prefix ${sampleDir} run ${startScript}`,
  ]
    .filter(Boolean)
    .join(' && ');

  console.log('dev', command);

  return command;
};

const startSampleAndRun = async () => {
  const params = getParameters();
  const { framework, build} = params;

  const waitOnOption = `tcp:127.0.0.1:${frameworkPort[framework]}`;

  // commands
  const runApp =
    build === BUILD_TYPE.dev ? runAppOnDev(params) : runAppOnProd(params);
  const runTest = `wait-on -t ${defaultTimeout} ${waitOnOption} && curl -o /dev/null -s -w "%{http_code}" http://localhost:${frameworkPort[framework]}/main.bundle-t.js |
  (read status; if [ "$status" = "200" ]; then exit 0; else echo "Received status code: $status"; exit 4; fi)`;

  const { result } = concurrently([runApp, runTest], {
    killOthers: ['success', 'failure'],
    successCondition: ['first'],
  });
  return result
    .then((results) => {
      process.exit(0);
    })
    .catch((exitInfos) => {
      // const exitCode = exitInfos.exitCode;
      // process.exit(exitCode);
      // Concurrently throws SIGTERM with exit code 0 on success, check code and exit with it
			const { exitCode } = exitInfos[0];
			process.exit(exitCode);
    });
};

(async () => {
  try {
    await startSampleAndRun();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();