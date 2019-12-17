### 使用

- `npm i thin-component` 安装包

### example

参考 [antd](https://ant.design/components/table-cn/) Table 组件用法, 具体用法可以参考 src/app/index.jsx 源码

## \* 注意！

1. columns 必须设置 width, 必须设置 scroll， scroll.y 代表滚动高度
2. webpack 的 rule 需要加 test: /(\.jsx)\$/ 并且 不要设置 exclude: /node_modules/

```json
{
  "test": /(\.jsx)$/
  // exclude: /node_modules/,
}
```

## 示例

```jsx
import React from 'react';
import { LazyTable } from 'thin-component';

class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      dataSource: this.getDataSource(),
      selectedRowKeys: ['10'],
    };
  }

  getDataSource = () => {
    const arr = [];
    for (let i = 0; i < 100; i += 1) {
      arr.push({
        key: `1${i}`,
        name: `胡彦斌${i}`,
        age: i,
        address: `西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号${i}`,
        school: `杭州${i}`,
        gender: '男',
      });
    }
    return arr;
  };

  click = r => {
    console.log(r);
  };

  getColumns = () => {
    const me = this;
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 36,
        render(v, r) {
          return <input defaultValue={v} onClick={me.click.bind(me, r)} />;
        },
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 48,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 200,
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        sorter: (a, b) => a.school.length - b.school.length,
      },
      {
        title: '学校',
        dataIndex: 'school',
        key: 'school',
        width: 200,
      },
    ];
  };

  render() {
    const { visible, dataSource, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: (s1, selectedRows) => {
        console.log(`selectedRowKeys: ${s1}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRowKeys: s1,
        });
        console.log('onChange');
      },
      onSelect: (record, selected) => {
        console.log(record);
        console.log(selected);
        console.log('onSelect');
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected);
        console.log(selectedRows);
        console.log(changeRows);
        console.log('alll---');
      },
      selectedRowKeys,
    };
    return (
      <div className="box">
        <div
          onClick={() => {
            this.setState({
              visible: !visible,
            });
          }}
        >
          搜索
        </div>
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
          rowHeight={40}
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={this.getColumns()}
          scroll={{ y: 325 }}
          rowKey="key"
          lazyLoading={false}
          onScrollBottom={() => {}}
          isResizeColumn
        />
      </div>
    );
  }
}

export default Demo;
```
