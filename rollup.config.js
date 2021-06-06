const plugins = [];
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const externals = require('rollup-plugin-node-externals');
const babel = require('rollup-plugin-babel');
const eslint = require('@rollup/plugin-eslint');

if (!isDev) {
	plugins.push(terser());
} else {
	plugins.push(sourceMaps());
}
module.exports = {
	input: './src/index.ts',
	output: [
		{
			file: './dist/index.js',
			format: 'cjs',
			sourcemap: isDev
		}
	],
	watch: {
		exclude: ['node_modules/**', 'test/**']
	},
	plugins: [
		externals({
			deps: true
		}),
		commonjs(),
		nodeResolve(),
		typescript({
			sourceMap: isDev,
			tsconfig: './tsconfig.json',
			exclude: 'test/**'
		}),
		babel(),
		...plugins
	]
};
