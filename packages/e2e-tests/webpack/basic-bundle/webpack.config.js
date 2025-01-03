import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

module.exports = {
	mode: 'development',
	entry: './src/app.ts',
	output: {
		filename: '[name].bundle.ts',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
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