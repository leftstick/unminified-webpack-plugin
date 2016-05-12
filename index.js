'use strict';

var webpack = require('webpack');
var ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

var UnminifiedWebpackPlugin = function(opts) {
    this.options = opts || {};
};

UnminifiedWebpackPlugin.prototype.apply = function(compiler) {
    var options = this.options;
    options.test = options.test || /\.js($|\?)/i;
    console.log(compiler.options.output.path);

    var containUgly = compiler.options.plugins.filter(function(plugin) {
        return plugin instanceof webpack.optimize.UglifyJsPlugin;
    });

    if (!containUgly.length) {
        return console.log('Ignore generating unminified version, since no UglifyJsPlugin provided');
    }

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('additional-chunk-assets', function(chunks) {

            var files = [];
            chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    files.push(file);
                });
            });
            compilation.additionalChunkAssets.forEach(function(file) {
                files.push(file);
            });
            files = files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, options));
            console.log(compilation.assets['index.bundle.js'].source());
        });
    });
};

module.exports = UnminifiedWebpackPlugin;
