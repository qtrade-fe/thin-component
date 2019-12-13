const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');

const webpackConfigProd = {
  output: {
    // 必须用chunkhash 否则vendor每次打包后hash都会变化就无法缓存了
    filename: '[name].[chunkhash].js',
    // 部署到生产 path是打包出的index.html的同级目录
    publicPath: `/qidian/`,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMETN: false,
      QD_CLIENT_VERSION: JSON.stringify(''),
    }),
    // 压缩优化代码
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  ],
  devtool: 'source-map',
};
if (process.env.BUILD_ENABLE_CDN === 'enable') {
  const WebpackCOSPlugin = require('webpack-cos-plugin');
  const cosPlugin = new WebpackCOSPlugin({
    useVersion: true,
    cosBaseDir: `${process.env.COS_CDN_ENV}`,
    exclude: /(.*\.html$)|(\.map$)|(asset-manifest\.json$)/, // 选填, 默认: /.*/
    options: {
      CacheControl: 'max-age=31536000',
      Expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toGMTString(),
    },
  });
  webpackConfigProd.output.publicPath = `//${process.env.COS_CDN_PUBLIC_URL}/${cosPlugin.finalPrefix}/`;
  webpackConfigProd.plugins.push(cosPlugin);
}

module.exports = merge(webpackConfigBase, webpackConfigProd);
