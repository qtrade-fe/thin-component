const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


const os = require('os');
const getIPAddress = () => {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};
const myHost = getIPAddress();

const webpackConfigDev = {
  output: {
    // webpack-dev-server不能用chunkhash 只能用hash
    filename: '[name].[hash].js',
    // 本地开发 path都是根路径localhost:8100
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      // react源码入口会判断process.env.NODE_ENV是development还是production做优化处理
      // 定义process.env.NODE_ENV让react源码读取 这里的process.env.NODE_ENV只可以在react源码及项目业务组件中读取
      'process.env.NODE_ENV': JSON.stringify('development'),
      IS_DEVELOPMETN: true,
      QD_CLIENT_VERSION: JSON.stringify('3.2'),
    }),
    // 控制台打印
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        // 通过 npm script cross-env NODE_ENV=abc 传参数
        // 这个参数只能在webpack配置中读取到
        messages: [`PROXY_ENV: ${process.env.PROXY_ENV}`],
        notes: ['Some additionnal notes to be displayed unpon successful compilation'],
      },
      onErrors: function (severity, errors) { },
    }),
    // 编译完成动态通知是否有error
    // new WebpackNotifierPlugin({
    //   title: 'Notify',
    //   excludeWarnings: true,
    //   skipFirstNotification: true
    // })
  ],
  // dev环境用eval-source-map prod环境用source-map
  devtool: 'eval-source-map',
  devServer: {
    host: myHost, // 设置0.0.0.0使得可以通过本机ip访问项目
    disableHostCheck: true,
    historyApiFallback: true,
    port: 8222,
    hot: true,
    open: true,
    // necessary for FriendlyErrorsPlugin
    quiet: true,
    proxy: {
      '/qtrade_bond': {
        target: 'https://test.qtrade.com.cn',
        changeOrigin: true,
      },
      '/qtrade-wss': {
        target: 'https://test.qtrade.com.cn',
        changeOrigin: true,
      },
      '/qtrade-app-box': {
        target: 'https://test.qtrade.com.cn',
        changeOrigin: true,
      },
    },
  },
};
module.exports = merge(webpackConfigBase, webpackConfigDev);
