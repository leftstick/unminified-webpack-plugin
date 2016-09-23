'use strict';

var webpack = require('webpack');
var path = require('path');
var UnminifiedWebpackPlugin = require('../index');
var fs = require('fs');
var assert = require('assert');
var del = require('del');

var resolve = path.resolve;

var curDir = path.resolve(__dirname);

var fileExist = function(filepath) {
    try {
        return fs.statSync(filepath).isFile();
    } catch (e) {
        return false;
    }
};

describe('testing', function() {

    beforeEach(function() {
        del.sync([resolve(curDir, 'build')]);
    });

    it('ignoring while no UglifyJsPlugin specified', function(done) {
        var compiler = webpack({
            entry: {
                index: resolve(curDir, 'simple', 'index.js')
            },
            output: {
                path: resolve(curDir, 'build'),
                filename: 'bundle.min.js'
            },
            plugins: [
                new UnminifiedWebpackPlugin()
            ]
        });

        compiler.run(function(err, stats) {
            assert(!fileExist(resolve(curDir, 'build', 'bundle.js')));
            done();
        });
    });

    it('generating while UglifyJsPlugin specified', function(done) {
        var compiler = webpack({
            entry: {
                index: resolve(curDir, 'simple', 'index.js')
            },
            output: {
                path: resolve(curDir, 'build'),
                filename: 'bundle.min.js'
            },
            plugins: [
                new webpack.BannerPlugin('The fucking shit'),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new UnminifiedWebpackPlugin()
            ]
        });

        compiler.run(function(err, stats) {
            assert(fileExist(resolve(curDir, 'build', 'bundle.js')));
            done();
        });
    });

    it('generating while UglifyJsPlugin specified and min in the bundle name', function(done) {
        var compiler = webpack({
            entry: {
                index: resolve(curDir, 'simple', 'index.js')
            },
            output: {
                path: resolve(curDir, 'build'),
                filename: 'minimal.min.js'
            },
            plugins: [
                new webpack.BannerPlugin('The fucking shit'),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new UnminifiedWebpackPlugin()
            ]
        });

        compiler.run(function(err, stats) {
            assert(fileExist(resolve(curDir, 'build', 'minimal.js')));
            done();
        });
    });

    it('generating while nonmin options specified', function(done) {
        var compiler = webpack({
            entry: {
                index: resolve(curDir, 'simple', 'index.js')
            },
            output: {
                path: resolve(curDir, 'build'),
                filename: 'bundle.js'
            },
            plugins: [
                new webpack.BannerPlugin('The fucking shit'),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new UnminifiedWebpackPlugin({postfix: 'nnnmin'})
            ]
        });

        compiler.run(function(err, stats) {
            assert(fileExist(resolve(curDir, 'build', 'bundle.nnnmin.js')));
            done();
        });
    });

});
