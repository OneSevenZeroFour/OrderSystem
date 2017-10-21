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
                exclude: /(node_modules)/,
                loader: "babel-loader"
            }
        ]
    },
    //未配置开发服务器
    devServer:{
        contentBase: "./public",
        inline:true,//实习刷新+编译
        compress: true,
        port: 10001
    }
}