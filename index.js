const webpack = require('webpack');
const legacy = require('./legacy');
const support5 = require('./support5');
try {
  const majorVersion = +webpack.version.match(/^[0-9]+/)[0];

  if (majorVersion >=5) {
    module.exports = support5;
  }
  else {
    module.exports = legacy;
  }
} catch (error) {
  console.error(`unknown webpack version: [${webpack.version}]`);
}
