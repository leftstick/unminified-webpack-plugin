unminified-webpack-plugin
=======================

[![NPM version][npm-image]][npm-url]
![][travis-url]
![][david-url]
![][dt-url]
![][license-url]


A `webpack` plugin for generating un-minified JavaScript files along with UglifyJsPlugin.

>This plugin should only be used while you are developing standalone library

## Why unminified-webpack-plugin ##

Maybe you are encountering the same issue as mine, once you are developing a standalone library via `webpack`, it's not possible to generate the uncompressed file along with the minified version at one time. [Here](http://stackoverflow.com/questions/25956937/how-to-build-minified-and-uncompressed-bundle-with-webpack) is the question i found at `stackoverflow`, it seems many people are suffering for this.

As a workaround, you may do something like `webpack && webpack --config webpack.config.prod.js`, but the solution is really ugly and inelegant.

That's why i am here! ^^

## Installation ##

```bash
npm install --save-dev unminified-webpack-plugin
```

## Usage ##

```javascript
var path = require('path');
var webpack = require('webpack');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'library.min.js'
    },
    plugins: [
        new UnminifiedWebpackPlugin()
    ]
};
```

By doing as above, you will get two files `library.min.js` and `library.js`. No need execute `webpack` twice, it just works!^^

>`filename` includes `min`, such as: `ad-min.js`, `ad-min-1.0.js`, will be treated as minified name as well. See [cope with 'min' in names like 'Admin'](https://github.com/leftstick/unminified-webpack-plugin/pull/8)

## Configuration ##

`postfix`: you can specify the `nomin` part as you wish. `nomin` is the default postfix once you haven't specify `min` in `output.filename`. And it can be customized by specifying this option, following is example:

```javascript
var path = require('path');
var webpack = require('webpack');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'library.js'//no "min" specified
    },
    plugins: [
        new UnminifiedWebpackPlugin({
            postfix: 'unmin'//specify "nomin" postfix,
            include: /polyfill.*/,
            exclude: /test.*/
        })
    ]
};
```

>By doing as above, you will get two files `library.js` and `library.unmin.js`

>`include`, `exclude` just work the same way as `UglifyJsPlugin`

>Check [working-example](https://github.com/leftstick/unminified-webpack-plugin/blob/master/example/css-pack/README.md) for css assets support

## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/unminified-webpack-plugin/master/LICENSE)


[npm-url]: https://npmjs.org/package/unminified-webpack-plugin
[npm-image]: https://badge.fury.io/js/unminified-webpack-plugin.png
[travis-url]:https://api.travis-ci.org/leftstick/unminified-webpack-plugin.svg?branch=master
[david-url]: https://david-dm.org/leftstick/unminified-webpack-plugin.png
[dt-url]:https://img.shields.io/npm/dt/unminified-webpack-plugin.svg
[license-url]:https://img.shields.io/npm/l/unminified-webpack-plugin.svg
