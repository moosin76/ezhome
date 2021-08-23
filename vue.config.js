const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const serverConfig = {
	entry: './src/entry-server.js',
	target: 'node',
	devtool: 'source-map',
	output: {
		libraryTarget: 'commonjs2',
	},
	externals: nodeExternals({
		allowlist: /\.css$/,
	}),
	optimization: {
		splitChunks: false,
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'server'),
		}),
		new VueSSRServerPlugin(),
	],
};

const cilentConfig = {
	entry: './src/entry-client.js',
	optimization: {
		runtimeChunk: {
			name: 'manifest',
		},
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'client'),
		}),
		new VueSSRClientPlugin(),
	],
};

module.exports = {
	devServer : {
		proxy : {
			'/api' : {
				target : `http://localhost:${process.env.VUE_APP_SERVER_PORT}`
			},
			'/upload' : {
				target : `http://localhost:${process.env.VUE_APP_SERVER_PORT}`
			}
		}
	},
	configureWebpack: process.env.VUE_ENV === 'server' ? serverConfig : cilentConfig,
}