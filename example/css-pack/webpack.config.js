const path = require('path');
const webpack = require('webpack');
const UnminifiedWebpackPlugin = require('../../');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new UnminifiedWebpackPlugin(),
        new ExtractTextPlugin('[name].min.css'),
        new OptimizeCssAssetsPlugin({
            //IMPORTANT: only minify asset ends with .min.css
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: cssnano
        })
    ]
};