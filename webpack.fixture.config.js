const path = require('path')
const nodeExternals = require('webpack-node-externals')
const appRoot = require('app-root-path')

module.exports = (env, argv) => {
  return ({
    entry: './fixtures/index.js',
    output: {
      path: path.join(__dirname, '.webpack/fixtures'),
      publicPath: '/',
      filename: 'main.js'
    },
    devtool: 'source-map',
    target: 'node',
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false, // if you don't put this is, __dirname
      __filename: false // and __filename return blank or /
    },
    externals: [nodeExternals({ modulesDir: appRoot + '/node_modules' })],
    resolve: {
      // modules: ['node_modules/'],
      modules: [appRoot + '/src', 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  })
}
