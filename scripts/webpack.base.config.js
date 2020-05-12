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
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    // 只支持ie9以上的es6转es5 babel需要转换的代码更少
                    browsers: ['IE >= 9'],
                  },
                  // 根据当前需要支持的浏览器(IE >= 9)按需加载babel-polyfill, 可以有效减少babel-polyfill体积
                  useBuiltIns: true,
                },
              ],
              'react',
              'stage-0',
            ],
            plugins: [
              // mobx支持装饰器语法
              'transform-decorators-legacy',
              // antd
              ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
            ],
          },
        },
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
  ],
};

module.exports = webpackConfigBase;
