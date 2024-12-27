const concurrently = require('concurrently');
const fs = require('fs-extra');
const { logError } = require('./common.js');

const defaultTimeout = 5 * 60 * 1000; // 5 minutes

const FRAMEWORKS = {
	react: 'react',
	angular: 'angular',
	ionic: 'ionic',
	vue: 'vue',
	node: 'node',
	next: 'next',
	vite: 'vite',
	rollup: 'rollup',
    webpack: 'webpack',
};

const frameworkPort = {
	[FRAMEWORKS.react]: '3000',
	[FRAMEWORKS.angular]: '4200',
	[FRAMEWORKS.ionic]: '8100',
	[FRAMEWORKS.vue]: '3000',
	[FRAMEWORKS.next]: '3000',
	[FRAMEWORKS.vite]: '3000',
	[FRAMEWORKS.rollup]: '3000',
    [FRAMEWORKS.webpack]: '3000',
};

const BUILD_TYPE = {
	dev: 'dev',
};

// bash command for installing node_modules if it is not present
// TODO: remove --ignore-engines when we update the cypress image
const npmInstall = (sampleDir) => {
	return fs.existsSync(`${sampleDir}/node_modules`)
		? `echo "Skipping npm install"`
		: `npm --prefix ${sampleDir} install`;
}; 

const sampleDirectory = ({ framework}) => {
	return `packages/e2e-tests/${framework}`;
};

// bash command for serving sample on prod
const runAppOnProd = ({ framework, backend, env }) => {
	const sampleDir = sampleDirectory({ framework});
	let distDir; // distribution directory
	if (framework === FRAMEWORKS.webpack) {
		distDir = `${sampleDir}/dist`;
	} else {
		logError(`unknown framework: ${framework}`);
	}
    //npm install the dependencies 
	const install = npmInstall(sampleDir);
    //env variables 
	const envVars = Object.entries(env)
		.map(([key, value]) => `${key}=${value}`)
		.join(' ');

	let buildCommand = 'build';
	let startCommand = 'start';
	if (backend === 'gen2') {
		buildCommand = 'build:gen2';
		startCommand = 'start:gen2';
	}
	const serveCommand =
		framework === 'next'
			? `npm --prefix ${sampleDir} run ${startCommand}`
			: `serve -s ${distDir} -l ${frameworkPort[framework]}`;

	const command = [
		envVars && `export ${envVars}`,
		install,
		`npm --prefix ${sampleDir} run ${buildCommand} ${prodFlag}`,
		serveCommand,
	]
		.filter(Boolean)
		.join(' && ');

	console.log('prod', command);

	return command;
};

const getDevStartCommand = ({ framework, backend }) => {
	const startWithbackendCmd = backend === 'gen2' ? 'start:gen2' : 'start';
	switch (framework) {
		case FRAMEWORKS.next:
			return 'dev';
		case FRAMEWORKS.vue:
			return 'serve';
		default:
			return startWithbackendCmd;
	}
};

// bash command for serving sample on dev
const runAppOnDev = ({ framework, backend, env }) => {
	const sampleDir = sampleDirectory({ framework});
	const install = npmInstall(sampleDir);
	const startScript = getDevStartCommand({ framework, backend });
	const envVars = Object.entries(env)
		.map(([key, value]) => `${key}=${value}`)
		.join(' ');

	const command = [
		envVars && `export ${envVars}`,
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
	const {
		framework,
		category,
		testFile,
		browser,
		build,
		sample,
	} = params;
	const sampleDir = sampleDirectory({ framework, category, sample });

	const waitOnOption =
		category === 'geo'
			? `http-get://127.0.0.1:${frameworkPort[framework]}`
			: `tcp:127.0.0.1:${frameworkPort[framework]}`;

	// commands
	const runApp =
		build === runAppOnDev(params);
	const runCypress = `wait-on -t ${defaultTimeout} ${waitOnOption} && cypress run --browser ${browser} --headless --config baseUrl=http://localhost:${frameworkPort[framework]} --spec "cypress/e2e/${category}/${testFile}.spec.*"`;

	return concurrently(
		[runApp, runCypress],
		{
			killOthers: ['success', 'failure'],
			successCondition: ['first'],
		}
	)
		.then(() => {
			process.exit(0);
		})
		.catch((exitInfos) => {
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