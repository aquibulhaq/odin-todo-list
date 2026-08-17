const { loadEnvFile } = require('node:process');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

try {
  loadEnvFile('./.env.development');
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ['./src/template.html'],
    host: process.env.APP_HOST ?? 'localhost',
    port: Number(process.env.APP_PORT ?? 8080),
  },
});
