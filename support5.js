const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

function isEmpty(obj) {
  return obj === null || obj === undefined;
}

function getFileName(name, ext, opts) {
  if (name.match(/([-_.]min)[-_.]/)) {
    return name.replace(/[-_.]min/, '');
  }

  const suffix = (opts.postfix || 'nomin') + '.' + ext;
  if (name.match(new RegExp('.' + ext + '$'))) {
    return name.replace(new RegExp(ext + '$'), suffix);
  }

  return name + suffix;
}

function shouldIgnore(mode, minimize) {
  // default config of mode => prod
  if (mode === 'production' && isEmpty(minimize)) {
    return false;
  }

  // specify minimize
  if (!isEmpty(minimize)) {
    return false;
  }

  // ignore for all rest cases
  return true;
}

function getBannerPlugin(plugins) {
  return (plugins || []).find((p) => p.constructor.name === 'BannerPlugin');
}

const pluginName = 'UnminifiedWebpackPlugin';

class UnminifiedWebpackPlugin {
  constructor(opts) {
    this.options = opts || {};
    this.options.test = this.options.test || /\.(js|css)($|\?)/i;
  }

  apply(compiler) {
    const options = this.options;

    if (
      shouldIgnore(
        compiler.options.mode,
        compiler.options.optimization.minimize,
      )
    ) {
      return console.log(
        'Ignore generating unminified version, since no UglifyJsPlugin provided, or running in development mode',
      );
    }

    const bannerPlugin = getBannerPlugin(compiler.options.plugins);

    const outputNormal = {};

    compiler.hooks.compilation.tap('UnminifiedWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'UnminifiedWebpackPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_DERIVED,
        },
        (assets) => {
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!ModuleFilenameHelpers.matchObject(options, pathname)) {
              return;
            }

            let matchedBanners = [];
            if (bannerPlugin) {
              matchedBanners = [pathname].filter(
                ModuleFilenameHelpers.matchObject.bind(
                  null,
                  bannerPlugin.options,
                ),
              );
            }

            const sourceCode = matchedBanners.length
              ? bannerPlugin.banner(bannerPlugin.options) + source.source()
              : source.source();

            const dest = compiler.options.output.path;
            const outputPath = path.resolve(
              dest,
              getFileName(pathname, path.extname(pathname).substr(1), options),
            );

            outputNormal[outputPath] = {
              filename: getFileName(
                pathname,
                path.extname(pathname).substr(1),
                options,
              ),
              content: sourceCode,
              size: Buffer.from(sourceCode, 'utf-8').length,
            };
          });
        },
      );

      compilation.hooks.afterProcessAssets.tap(
        'UnminifiedWebpackPlugin',
        () => {
          for (const [key, value] of Object.entries(outputNormal)) {
            compilation.emitAsset(
              value.filename,
              new webpack.sources.RawSource(value.content),
            );
          }
        },
      );
    });
  }
}

module.exports = UnminifiedWebpackPlugin;
