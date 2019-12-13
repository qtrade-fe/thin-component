module.exports = {
  // eslint找当前配置文件不再往父级查找
  root: true,
  extends: ['qtrade'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'scripts/webpack.base.config.js',
      },
    },
  },
};
