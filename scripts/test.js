// const { parseArgs } = require('node:util');
const concurrently = require('concurrently');
const fs = require('fs-extra');
const { logError } = require('./common.js').default;

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

const BUILD_TYPE = {
	dev: 'dev',
	prod: 'prod',
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

const SUPPORTED_BROWSERS = [
	'chrome',
	'chromium',
	'edge',
	'electron',
	'firefox',
	'webkit',
];
const isSupportedBrowser = (browser) => {
	return SUPPORTED_BROWSERS.includes(browser);
};

// Read arguments from process.argv, validate them, and assign defaults. Returns the parameter list.
const getParameters = () => {
	let {
		values: { env },
		positionals: [
			framework,
			category,
			sample,
			testFile,
			browser,
			build,
			backend,
			amplifyJsDir,
		],
	} = parseArgs({
		options: {
			env: {
				type: 'string',
			},
		},
		allowPositionals: true,
	});

	if (!framework || !FRAMEWORKS.hasOwnProperty(framework)) {
		logError(`Please enter a valid framework: ${[...Object.keys(FRAMEWORKS)]}`);
		process.exit(1);
	}

	if (!category) {
		logError('Please enter a valid category');
		process.exit(1);
	}
	if (!sample || !fs.existsSync(`samples/${framework}/${category}/${sample}`)) {
		logError('Please enter a valid sample name');
		process.exit(1);
	}
	if (!testFile) {
		testFile = sample;
	}
	if (!browser || !isSupportedBrowser(browser)) {
		browser = 'chrome';
	}
	if (!build || !BUILD_TYPE.hasOwnProperty(build)) {
		build = 'dev';
	}
	if (!backend) {
		backend = 'cli';
	}
	return {
		framework,
		category,
		sample,
		testFile,
		browser,
		build,
		amplifyJsDir,
		backend,
		env: JSON.parse(env || '{}'),
	};
};

// bash command for installing node_modules if it is not present
// TODO: remove --ignore-engines when we update the cypress image
const npmInstall = (sampleDir) => {
	return fs.existsSync(`${sampleDir}/node_modules`)
		? `echo "Skipping npm install"`
		: `npm --prefix ${sampleDir} install`;
}; 

const sampleDirectory = ({ framework, category, sample }) => {
	return `samples/${framework}/${category}/${sample}`;
};

// bash command for serving sample on prod
const runAppOnProd = ({ framework, category, sample, backend, env }) => {
	const sampleDir = sampleDirectory({ framework, category, sample });
	let distDir; // distribution directory
	if (framework === FRAMEWORKS.webpack) {
		const { name } = JSON.parse(fs.readFileSync(`${sampleDir}/package.json`));
		distDir = `${sampleDir}/dist/${name}`;
	} else if (framework === FRAMEWORKS.react || framework === FRAMEWORKS.next) {
		distDir = `${sampleDir}/build`;
	} else if (framework === FRAMEWORKS.vue || framework === FRAMEWORKS.vite) {
		distDir = `${sampleDir}/dist`;
	} else if (framework === FRAMEWORKS.rollup) {
		distDir = `${sampleDir}/public`;
	} else if (framework === FRAMEWORKS.ionic) {
		distDir = `${sampleDir}/www`;
	} else if (framework === FRAMEWORKS.javascript) {
		distDir = `${sampleDir}/dist`;
	} else {
		logError(`unknown framework: ${framework}`);
	}
	const install = npmInstall(sampleDir);
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
const runAppOnDev = ({ framework, category, sample, backend, env }) => {
	const sampleDir = sampleDirectory({ framework, category, sample });
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
		build === BUILD_TYPE.dev ? runAppOnDev(params) : runAppOnProd(params);
	const runCypress = `wait-on -t ${defaultTimeout} ${waitOnOption} && cypress run --browser ${browser} --headless --config baseUrl=http://localhost:${frameworkPort[framework]} --spec "cypress/integration/${category}/${testFile}.spec.*"`;

	return concurrently(
		framework === FRAMEWORKS.node
			? [installAndRunNodeTests]
			: [runApp, runCypress],
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