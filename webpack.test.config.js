const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const appRoot = require('app-root-path')
const path = require('path')
const isCoverage = process.env.NODE_ENV === 'coverage'

module.exports = {
  // output: {
  //   // use absolute paths in sourcemaps (important for debugging via IDE)
  //   devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  //   devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  // },
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [].concat(
      isCoverage ? {
        test: /\.(js)/,
        include: path.resolve('src'), // instrument only testing sources with Istanbul, after ts-loader runs
        loader: 'istanbul-instrumenter-loader'
      } : [],
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    )
  },
  resolve: {
    modules: [appRoot + '/src', 'node_modules']
  },
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-cheap-module-source-map'
}
