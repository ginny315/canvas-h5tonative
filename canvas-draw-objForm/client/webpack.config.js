var webpack = require('webpack');

module.exports = {
  entry: ['whatwg-fetch', './dist/main.js'],
  output: {
    path: './client/dist/',
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
		loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
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
        test: /\.(css|scss|styl)$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!stylus-loader!sass-loader'
      }
    ]
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  },
  devtool: '#source-map',
  debug: true,
    // plugins: [
    //    new webpack.optimize.UglifyJsPlugin({
    //        compress: {
    //            warnings: false
    //        }
    //    }),
    //    new webpack.optimize.OccurenceOrderPlugin()]
  plugins: [
    new webpack.BannerPlugin('created by ginny')
  ]
};
