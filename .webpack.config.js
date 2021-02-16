const path = require('path');
module.exports = {
  entry: {
    // include core-js as an entry point for the polyfills it provides
    app: ['core-js/stable', './src/js/index.js']
  },
  output: {
    // output into a single file dist/js/main.js
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  module: {
    rules: [
      {
        // any .js (or .mjs) file should be passed through Babel
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  mode: 'development'
}
