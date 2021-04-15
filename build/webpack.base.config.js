const path = require('path')
const webpack = require('webpack')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: 'production',
  devtool: isProd
    ? false
    : 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  optimization: isProd ? {
    minimize: true,
    minimizer: [new TerserPlugin()],
  } : {},
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.styl(us)?$/,
        use: isProd
          ? [
            {
              loader: ExtractCssChunksPlugin.loader,
              options: {
                hot: !isProd,
                reloadAll: !isProd
              }
            },
            {
              loader: 'css-loader',
            },
            'stylus-loader',
          ]
          : ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: isProd
          ? [
            {
              loader: ExtractCssChunksPlugin.loader,
              options: {
                hot: !isProd,
                reloadAll: !isProd
              }
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {},
            },
          ]
          : [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {},
            },
          ],
      },
    ]
  },
  performance: {
    hints: false
  },
  plugins: isProd
    ? [
      new VueLoaderPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractCssChunksPlugin({
        filename: isProd ? 'css/[name].[contenthash:8].css' : '[name].css',
        chunkFilename: isProd ? 'css/[name].[contenthash:8].chunk.css' : '[name].chunk.css'
      })
    ]
    : [
      new VueLoaderPlugin(),
      new FriendlyErrorsPlugin(),
      new ExtractCssChunksPlugin({
        filename: isProd ? 'css/[name].[contenthash:8].css' : '[name].css',
        chunkFilename: isProd ? 'css/[name].[contenthash:8].chunk.css' : '[name].chunk.css'
      })
    ]
}
