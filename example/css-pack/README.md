css-pack
=======================


Working example for extracting non-minified css asset

## Installation ##

```bash
npm install
```

## Usage ##

```bash
npm run build
```

>You would see, `app.js`, `app.min.js`, `app.css`, `app.min.css` are generated at `dist` folder

## Configuration ##

**You should not minify css via `css-loader`, but leave it to [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)**

```javascript
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
        //use optimize-css-assets-webpack-plugin to minify css assets
        new OptimizeCssAssetsPlugin({
            //IMPORTANT: only minify asset ends with .min.css
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: cssnano
        })
    ]
};
```
