unminified-webpack-plugin
=======================

[![NPM version][npm-image]][npm-url]
![][travis-url]
![][david-url]
![][dt-url]
![][license-url]


A `webpack` plugin for generating un-minified JavaScript files along with UglifyJsPlugin.

## Why unminified-webpack-plugin ##

Once you'd like to release your library, it's better to release a un-minified version along with uglified one. But it's hard to make it work with normal webpack process. Of course you can have some workaround like: `webpack && webpack --config webpack.config.prod.js`, the cons by doing that are: you have to maintain two `config` files; and cost twice as long as generating one output.

## Installation ##

```bash
npm install --save-dev unminified-webpack-plugin
```

## Usage ##

```javascript

```


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/unminified-webpack-plugin/master/LICENSE)


[npm-url]: https://npmjs.org/package/unminified-webpack-plugin
[npm-image]: https://badge.fury.io/js/unminified-webpack-plugin.png
[travis-url]:https://api.travis-ci.org/leftstick/unminified-webpack-plugin.svg?branch=master
[david-url]: https://david-dm.org/leftstick/unminified-webpack-plugin.png
[dt-url]:https://img.shields.io/npm/dt/unminified-webpack-plugin.svg
[license-url]:https://img.shields.io/npm/l/unminified-webpack-plugin.svg
