const webpack = require('webpack');
const [webpackClientConfig, webpackServerConfig] = require('../webpack.config');
const nodemon = require('nodemon');
const path = require('path');

console.log('prod.js enter');
console.log(`__dirname: ${__dirname}`);
const compiler = webpack([webpackServerConfig, webpackClientConfig]);

compiler.run((err) => {
  console.log('Compilation start');
  if (err) {
    console.log(`compilation failed:`, err);
  }

  compiler.watch({}, (err) => {
    if (err) {
      console.log(`compilation failed:`, err);
    }

    console.log('Compilation was successful');
  });

  nodemon({
    script: path.resolve(__dirname, '../dist/server/server.js'),
  });
});
