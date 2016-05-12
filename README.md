NoMinifiedEmiterPlugin
=======================

[![NPM version][npm-image]][npm-url]
![][travis-url]
![][david-url]
![][dt-url]
![][license-url]


A `webpack` plugin for generating un-minified JavaScript files along with UglifyJsPlugin.

## Why NoMinifiedEmiterPlugin ##

Once you'd like to release your library, it's better to release a un-minified version along with uglified one. But it's hard to make it work with normal webpack process. Of course you can have some workaround like: `webpack && webpack --config webpack.config.prod.js`, the cons by doing that are: you have to maintain two `config` files; and cost twice as long as generating one output.

## Installation ##

```bash
npm install --save-dev NoMinifiedEmiterPlugin
```

## Usage ##

```javascript

```


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/NoMinifiedEmiterPlugin/master/LICENSE)


[npm-url]: https://npmjs.org/package/NoMinifiedEmiterPlugin
[npm-image]: https://badge.fury.io/js/NoMinifiedEmiterPlugin.png
[travis-url]:https://api.travis-ci.org/leftstick/NoMinifiedEmiterPlugin.svg?branch=master
[david-url]: https://david-dm.org/leftstick/NoMinifiedEmiterPlugin.png
[dt-url]:https://img.shields.io/npm/dt/NoMinifiedEmiterPlugin.svg
[license-url]:https://img.shields.io/npm/l/NoMinifiedEmiterPlugin.svg
