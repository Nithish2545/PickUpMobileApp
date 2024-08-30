const path = require('path');

module.exports = {
  entry: './src/index.web.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'web-build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
