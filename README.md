### 使用

- `npm i thin-component` 安装包

### example

参考 [antd](https://ant.design/components/table-cn/) Table 组件用法, 具体用法可以参考 src/app/index.jsx 源码

## \* 注意！

1. columns 必须设置 width
2. webpack 的 rule 需要加 test: /(\.jsx)\$/ 并且 不要设置 exclude: /node_modules/

````js
{
    test: /(\.jsx)$/,
    // exclude: /node_modules/,
}
```
## 示例

```jsx
import { LazyTable } from 'thin-component'

<LazyTable
  // loadingElement={<div>哈哈哈佳佳...</div>}
  loading={false}
  onCell={() => {
    return {};
  }}
  onRow={() => {
    return {};
  }}
  headerCellClassName="header-cell "
  rowCellClassName="cell"
  rowClassName={(record, index) => {
    if (index % 2 !== 0) {
      return 'row-bg';
    }
    return '';
  }}
  loadingTip="加载中..."
  rowSelection={{}}
  dataSource={[]}
  columns={[
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 200,
      sorter: (a, b) => a.age - b.age,
    },
  ]}
  scroll={{ y: 325 }}
  rowKey="id"
  lazyLoading={false}
  onScrollBottom={() => {}}
/>
````
