'use strict';

var webpack = require('webpack');
var ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');


var getFileName = function(name, opts) {
    var minIndex = name.indexOf('min');
    if (minIndex > -1) {
        return name.substring(0, minIndex - 1) + name.substring(minIndex + 3);
    }
    var nonmin = opts.postfix || 'nomin';
    var jsIndex = name.indexOf('js');
    if (jsIndex > -1) {
        return name.substring(0, jsIndex - 1) + '.' + nonmin + '.js';
    }
    return name + nonmin + '.js';
};

var UnminifiedWebpackPlugin = function(opts) {
    this.options = opts || {};
};

UnminifiedWebpackPlugin.prototype.apply = function(compiler) {
    var options = this.options;
    options.test = options.test || /\.js($|\?)/i;

    var containUgly = compiler.options.plugins.filter(function(plugin) {
        return plugin instanceof webpack.optimize.UglifyJsPlugin;
    });

    if (!containUgly.length) {
        return console.log('Ignore generating unminified version, since no UglifyJsPlugin provided');
    }

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('additional-chunk-assets', function(chunks, cb) {
            var files = [];
            chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    files.push(file);
                });
            });
            compilation.additionalChunkAssets.forEach(function(file) {
                files.push(file);
            });
            files = files.filter(ModuleFilenameHelpers.matchObject.bind(null, options));
            files.forEach(function(file) {
                var asset = compilation.assets[file];
                compilation.assets[getFileName(file, options)] = {
                    source: function() {
                        return asset.source();
                    },
                    size: function() {
                        return asset.source().length;
                    }
                };
            });
        });
    });
};

module.exports = UnminifiedWebpackPlugin;
