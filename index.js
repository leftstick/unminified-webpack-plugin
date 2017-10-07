const webpack = require('webpack');
const path = require('path');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

const getFileName = (name, ext, opts) => {
    if (name.match(/([-_.]min)[-_.]/)) {
        return name.replace(/[-_.]min/, '');
    }

    const suffix = (opts.postfix || 'nomin') + '.' + ext;
    if (name.match(new RegExp('\.' + ext + '$'))) {
        return name.replace(new RegExp(ext), suffix)
    }

    return name + suffix;
};

const UnminifiedWebpackPlugin = function(opts) {
    this.options = opts || {};
};

UnminifiedWebpackPlugin.prototype.apply = function(compiler) {
    const options = this.options;
    options.test = options.test || /\.(js|css)($|\?)/i;

    const containUgly = compiler.options.plugins.filter(plugin => plugin.constructor.name === 'UglifyJsPlugin');

    if (!containUgly.length) {
        return console.log('Ignore generating unminified version, since no UglifyJsPlugin provided');
    }

    compiler.plugin('compilation', (compilation) => {
        compilation.plugin('additional-assets', (cb) => {
            const files = [];
            compilation.chunks.forEach(chunk => {
                chunk.files.forEach(file => {
                    files.push(file);
                });
            });
            compilation.additionalChunkAssets.forEach(file => {
                files.push(file);
            });

            const finalFiles = files.filter(ModuleFilenameHelpers.matchObject.bind(null, options));
            finalFiles.forEach(file => {
                const asset = compilation.assets[file];
                const source = asset.source();
                compilation.assets[getFileName(file, path.extname(file).substr(1), options)] = {
                    source: () => source,
                    size: () => source.length
                };
            });
            cb();
        });

    });
};

module.exports = UnminifiedWebpackPlugin;
