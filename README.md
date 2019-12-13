### 使用

- `npm i` 安装包
- `npm start`或者`npm run dev` 启动本地开发环境
- `npm build` 打包

### example

参考 [antd](https://ant.design/components/table-cn/) Table 组件用法, 具体用法可以参考 src/app/index.jsx 源码

## \* 注意！ columns 必须设置 width

```jsx
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
```
