const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const appRoot = require('app-root-path')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals({ modulesDir: appRoot + '/node_modules' })],
  // externals: [nodeExternals({ modulesFromFile: true })],
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: __dirname,
      exclude: /node_modules/
    }]
  },
  resolve: {
  // modules: ['node_modules/'],
    modules: [appRoot + '/src', 'node_modules']
  }
}
