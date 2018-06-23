const path = require('path');
const fs = require('fs');
const libPath = path.join(__dirname, 'lib');
const wwwPath = path.join(__dirname, 'www');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const pkg = require('./package.json');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// const babelSettings = {
// 	// https://github.com/babel/babel-loader#options
// 	cacheDirectory: true,
// 	presets: [
// 		require.resolve('babel-preset-es2015-node6'),
// 	],
// };

module.exports = {
	entry: path.join(libPath, 'index.js'),
	devtool: 'source-map',
	output: {
		path: wwwPath,
		filename: 'simulator-[hash:6].js',
	},
	module: {
		rules: [
			{
				test: /[\/]angular\.js$/,
				loader: 'expose-loader?angular!exports-loader?window.angular',
			}, {
				test: /\.(html|svg)$/,
				loader: 'html-loader',
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader?importLoaders=1',
					'postcss-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.json', '.css', '.html'],
		modules: [
			libPath,
			'node_modules',
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			pkg,
			template: path.join(libPath, 'index.ejs'),
		}),
	],
};
