const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfigAnalyze = {
  output: {
    // 必须用chunkhash 否则vendor每次打包后hash都会变化就无法缓存了
    filename: '[name].[chunkhash].js',
    // 部署到生产 path是打包出的index.html的同级目录
    publicPath: `./`,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMETN: false,
    }),
    // 压缩优化代码
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    // 分析代码
    new BundleAnalyzerPlugin({ analyzerPort: 3011 }),
  ],
};

module.exports = merge(webpackConfigBase, webpackConfigAnalyze);
