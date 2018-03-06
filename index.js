const webpack = require('webpack');
const path = require('path');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

const getFileName = function(name, ext, opts) {
    if (name.match(/([-_.]min)[-_.]/)) {
        return name.replace(/[-_.]min/, '');
    }

    const suffix = (opts.postfix || 'nomin') + '.' + ext;
    if (name.match(new RegExp('\.' + ext + '$'))) {
        return name.replace(new RegExp(ext + '$'), suffix)
    }

    return name + suffix;
};

const UnminifiedWebpackPlugin = function(opts) {
    this.options = opts || {};
};

UnminifiedWebpackPlugin.prototype.apply = function(compiler) {
    const options = this.options;
    options.test = options.test || /\.(js|css)($|\?)/i;

    const containUgly = compiler.options.plugins.filter(function(plugin) {
        return plugin.constructor.name === 'UglifyJsPlugin';
    });

    if (!containUgly.length && compiler.options.mode === 'development') {
        return console.log('Ignore generating unminified version, since no UglifyJsPlugin provided, or running in development mode');
    }

    compiler.hooks.compilation.tap('UnminifiedWebpackPlugin', function(compilation) {
        compilation.hooks.additionalAssets.tap('UnminifiedWebpackPlugin', function() {
            const files = [];
            compilation.chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    files.push(file);
                });
            });
            compilation.additionalChunkAssets.forEach(function(file) {
                files.push(file);
            });

            const finalFiles = files.filter(ModuleFilenameHelpers.matchObject.bind(null, options));


            const bannerPlugin = compiler.options.plugins.find(function(plugin) {
                return plugin.constructor.name === 'BannerPlugin';
            });

            finalFiles.forEach(function(file) {
                const asset = compilation.assets[file];
                let matchedBanners = [];
                if (bannerPlugin) {
                    matchedBanners = [file].filter(ModuleFilenameHelpers.matchObject.bind(null, bannerPlugin.options));
                }
                const source = matchedBanners.length ? bannerPlugin.banner + asset.source() : asset.source();
                compilation.assets[getFileName(file, path.extname(file).substr(1), options)] = {
                    source: function() {
                        return source;
                    },
                    size: function() {
                        return source.length;
                    }
                };
            });
        });

    });
};

module.exports = UnminifiedWebpackPlugin;
