import { join } from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default {
	input: join(__dirname, 'src/app.ts'),
	output: {
		// file: join(__dirname, 'dist', 'rollup', 'main.js'),
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
			preventAssignment: true,
		}),
		nodeResolve({
			extensions: ['.js', '.jsx'],
			preferBuiltins: false,
			browser: true,
		}),
		commonjs(),
		terser(),
	],
};