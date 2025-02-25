const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: './src/app.ts',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	devServer: {
		client: {
			overlay: true
		},
		static: {
			directory: './dist'
		},
		hot: true,
		port: 3000,
		allowedHosts: 'all',
	},
	plugins: [
        new CopyWebpackPlugin({
			patterns: ['index.html'],
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
};