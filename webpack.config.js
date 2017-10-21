var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: "./index.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.js[x]?$/,
                loader: "babel-loader"
            }
        ]
    }
    //未配置开发服务器
}