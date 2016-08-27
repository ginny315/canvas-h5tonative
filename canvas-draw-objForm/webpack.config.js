var webpack = require('webpack');

module.exports = {
  entry: ['whatwg-fetch', './client/main.js'],
  output: {
    path: './client/dist/',
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
		loaders: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        exclude: /node_modules/,
        query: {
          // inline files smaller then 1kb as base64 dataURL
          limit: 1000,
          // fallback to file-loader with this naming scheme
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  devtool: '#source-map',
  debug: true,
  plugins: [
    new webpack.BannerPlugin('created by ginny')
  ]
};
