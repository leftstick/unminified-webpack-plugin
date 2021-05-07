'use strict';

const webpack = require('webpack');
const path = require('path');
const UnminifiedWebpackPlugin = require('../index');
const fs = require('fs');
const assert = require('assert');
const del = require('del');

const resolve = path.resolve;

const curDir = path.resolve(__dirname);

function fileExist(filepath) {
  try {
    return fs.statSync(filepath).isFile();
  } catch (e) {
    return false;
  }
}

function readFile(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    return '';
  }
}

describe('testing', function () {
  beforeEach(function () {
    del.sync([resolve(curDir, 'build')]);
  });

  it('ignoring while no UglifyJsPlugin specified', function (done) {
    const compiler = webpack({
      mode: 'development',
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'bundle.min.js',
      },
      plugins: [new UnminifiedWebpackPlugin()],
    });

    compiler.run(function (err, stats) {
      assert(!fileExist(resolve(curDir, 'build', 'bundle.js')));
      done();
    });
  });

  describe('generating while UglifyJsPlugin specified', function () {
    it('normal output file name', function (done) {
      const compiler = webpack({
        mode: 'production',
        entry: {
          index: resolve(curDir, 'simple', 'index.js'),
        },
        output: {
          path: resolve(curDir, 'build'),
          filename: 'bundle.min.js',
        },
        plugins: [
          new webpack.BannerPlugin('The fucking shit'),
          new UnminifiedWebpackPlugin(),
        ],
      });

      compiler.run(function (err, stats) {
        assert(fileExist(resolve(curDir, 'build', 'bundle.js')));
        done();
      });
    });

    it('admin.js as output', function (done) {
      const compiler = webpack({
        mode: 'production',
        entry: {
          index: resolve(curDir, 'simple', 'index.js'),
        },
        output: {
          path: resolve(curDir, 'build'),
          filename: 'admin.js',
        },
        plugins: [new UnminifiedWebpackPlugin()],
      });

      compiler.run(function (err, stats) {
        assert(fileExist(resolve(curDir, 'build', 'admin.nomin.js')));
        done();
      });
    });

    it('ad-min.js as output', function (done) {
      const compiler = webpack({
        mode: 'production',
        entry: {
          index: resolve(curDir, 'simple', 'index.js'),
        },
        output: {
          path: resolve(curDir, 'build'),
          filename: 'ad-min.js',
        },
        plugins: [new UnminifiedWebpackPlugin()],
      });

      compiler.run(function (err, stats) {
        assert(fileExist(resolve(curDir, 'build', 'ad.js')));
        done();
      });
    });

    it('ad-min-1.0.0.js as output', function (done) {
      const compiler = webpack({
        mode: 'production',
        entry: {
          index: resolve(curDir, 'simple', 'index.js'),
        },
        output: {
          path: resolve(curDir, 'build'),
          filename: 'ad-min-1.0.0.js',
        },
        plugins: [new UnminifiedWebpackPlugin()],
      });

      compiler.run(function (err, stats) {
        assert(fileExist(resolve(curDir, 'build', 'ad-1.0.0.js')));
        done();
      });
    });

    it('Admin/js/Admin.js as output', function (done) {
      const compiler = webpack({
        mode: 'production',
        entry: {
          index: resolve(curDir, 'simple', 'index.js'),
        },
        output: {
          path: resolve(curDir, 'build'),
          filename: 'Admin/js/Admin.js',
        },
        plugins: [new UnminifiedWebpackPlugin()],
      });

      compiler.run(function (err, stats) {
        assert(fileExist(resolve(curDir, 'build', 'Admin/js/Admin.nomin.js')));
        done();
      });
    });
  });

  it('generating while no UglifyJsPlugin specified and min in the bundle name', function (done) {
    const compiler = webpack({
      mode: 'production',
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'minimal.min.js',
      },
      plugins: [
        new webpack.BannerPlugin('The fucking shit'),
        new UnminifiedWebpackPlugin(),
      ],
    });

    compiler.run(function (err, stats) {
      assert(fileExist(resolve(curDir, 'build', 'minimal.js')));
      done();
    });
  });

  it('generating while nonmin options specified', function (done) {
    const compiler = webpack({
      mode: 'production',
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'bundle.js',
      },
      plugins: [
        new webpack.BannerPlugin('The fucking shit'),
        new UnminifiedWebpackPlugin({ postfix: 'nnnmin' }),
      ],
    });

    compiler.run(function (err, stats) {
      assert(fileExist(resolve(curDir, 'build', 'bundle.nnnmin.js')));
      done();
    });
  });

  it('generating while include optione provided', function (done) {
    const compiler = webpack({
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'bundle.min.js',
      },
      plugins: [new UnminifiedWebpackPlugin({ include: 'nothing' })],
    });

    compiler.run(function (err, stats) {
      assert(!fileExist(resolve(curDir, 'build', 'bundle.js')));
      done();
    });
  });

  it('generating while exclude optione provided', function (done) {
    const compiler = webpack({
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'bundle.min.js',
      },
      plugins: [new UnminifiedWebpackPlugin({ include: /ad.*/ })],
    });

    compiler.run(function (err, stats) {
      assert(!fileExist(resolve(curDir, 'build', 'bundle.js')));
      done();
    });
  });

  it('generating while bannerplugin involved', function (done) {
    const compiler = webpack({
      mode: 'production',
      entry: {
        index: resolve(curDir, 'simple', 'index.js'),
      },
      output: {
        path: resolve(curDir, 'build'),
        filename: 'bundle.min.js',
      },
      plugins: [
        new webpack.BannerPlugin('This is a real test'),
        new UnminifiedWebpackPlugin(),
      ],
    });

    compiler.run(function (err, stats) {
      assert(fileExist(resolve(curDir, 'build', 'bundle.js')));
      assert(
        readFile(resolve(curDir, 'build', 'bundle.js')).startsWith(
          '/*! This is a real test */',
        ),
      );
      done();
    });
  });
});
