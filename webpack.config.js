var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
/*extract-text-webpack-plugin将你的样式提取到单独的css文件里，*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: { //配置入口文件，有几个写几个
        main: './src/com/main.ts',
        login: './src/com/login/login.ts'
    },
    output: {
        path: __dirname + '/dist', //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/dev/',       //模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js',     //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },
    plugins: [
        new webpack.ProvidePlugin({
            TWEEN: 'tween.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['main', 'login'], //提取哪些模块共有的部分
            minChunks: 2 // 提取至少3个模块共有的部分
        }),
        new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath

        //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            filename: './main/index.html', //生成的html存放路径，相对于path
            template: './src/htmls/index.html', //html模板路径
            inject: 'body', //js插入的位置，true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            chunks: ['vendors', 'main'],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            filename: './login/index.html', //生成的html存放路径，相对于path
            template: './src/htmls/login.html', //html模板路径
            inject: true, //js插入的位置，true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            chunks: ['vendors', 'login'],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            /*{ test: /\.ts$/, loader: 'ts-loader' },*/
            {test: /\.ts$/, loader: 'awesome-typescript-loader'},
            {
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]
                })
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css-loader!less-loader')
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
        ]
    },
    //webpack-dev-server
    devServer: {
        contentBase: './',
        host: 'localhost',
        port: 8090, //默认8080
        inline: true //可以监控js变化
    }
};