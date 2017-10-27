/**
 * @info:react webpack config
 */
const webpack = require("webpack");

module.exports = {
	devtool: "source-map",
	entry: "./index.js",
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.css$/,
			exclude: /(node_modules)/,
			loader: "style-loader!css-loader"
		},{
			test: /\.scss$/,
			exclude: /(node_modules)/,
			loader: "style-loader!css-loader!sass-loader"
		}, {
			test: /\.(svg|woff|ttf|eot)$/,
			loader: "file-loader"
		}, {
			test: /\.html$/,
			loader: "html-loader"
		}, {
			test: /\.jpg|png|gif|jpeg|bmp$/,
			loader: "url-loader"
		}, {
			test: /\.js[x]?$/,
			exclude: /(node_modules)/,
			loader: "babel-loader"
		}]
	},
	watch: true,
	devServer: {
		contentBase: "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: true, //实时刷新
		compress: true,
		port: 10001
	}
}