module.exports = {
  presets: [
    ["env", {
      "targets": {
        // 只支持ie9以上的es6转es5 babel需要转换的代码更少
        "browsers": ["IE >= 9"]
      },
      // 根据当前需要支持的浏览器(IE >= 9)按需加载babel-polyfill, 可以有效减少babel-polyfill体积
      "useBuiltIns": true
    }],
    "react",
    "stage-0"
  ],
  plugins: [
    // mobx支持装饰器语法
    "transform-decorators-legacy",
    // antd
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }]
  ]
}
