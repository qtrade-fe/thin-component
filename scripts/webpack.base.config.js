const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = relatedPath => path.resolve(__dirname, relatedPath);

const webpackConfigBase = {
  entry: {
    vendor: ['react', 'react-dom'],
    main: resolve('../src/main.jsx'),
  },
  output: {
    path: resolve('../dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@src': resolve('../src'),
      '@document': resolve('../src/assets/document'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [`babel-loader`],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        exclude: [resolve('../node_modules')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // less modules
              // modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[hash:8].[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('../src/index.html'),
    }),
    // 如果不配置下面 只有main.js和vendor.js 每次修改代码后打包 这两个js的chunkhash值都变化了 不利于vendor.js的缓存
    // 配置了下面 每次修改代码后打包 只变化main mainfest的chunkhash, vendor chunkhash不变化 可以缓存vendor
    // filename和chunkFilename必须使用chunkhash才能让以上规则生效
    // 开发环境webpack-dev-server必须用的hash不能用chunkhash 所以开发环境以上规则不生效
    new webpack.optimize.CommonsChunkPlugin({
      // vendor包括的是一些不常变化的库
      // manifest再抽出此次打包过程中vendor这些库变化的部分(一般都很小)
      // 所以mainfest.js很小每次chunkhash变化了请求也无所谓
      // vendor.js很大 但是chunkhash不变化 一直缓存着 从而提高加载速度
      name: 'manifest',
      chunks: ['vendor'],
    }),
  ],
};

module.exports = webpackConfigBase;
