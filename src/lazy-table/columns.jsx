/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import Sorter from './sorter';

class Columns extends React.Component {
  constructor() {
    super();
    this.state = {
      sorterActiveField: '',
      sorterDirection: 'default',
    };
  }

  handleCheckboxChange = e => {
    const { rowSelection, dataSource } = this.props;
    const { checked } = e.target;

    const { onChange = () => {}, onSelectAll = () => {}, selectedRowKeys = [] } = rowSelection;
    let tem = [];
    let selectedRows = [];
    if (checked) {
      tem = dataSource.map(item => {
        return item.key;
      });
      selectedRows = [...dataSource];
    }

    onChange(tem, selectedRows);
    const changeRows = this.getChangeRows(dataSource, checked, selectedRowKeys);
    onSelectAll(checked, selectedRows, changeRows);
  };

  getChangeRows = (dataSource, checked, selectedRowKeys) => {
    const allKeys = dataSource.map(item => {
      return item.key;
    });
    const changeRows = [];
    const len = allKeys.length;
    if (checked) {
      for (let i = 0; i < len; i += 1) {
        const key = allKeys[i];
        if (selectedRowKeys.indexOf(key) === -1) {
          changeRows.push(key);
        }
      }
      return dataSource.filter(item => {
        return changeRows.indexOf(item.key) > -1;
      });
    }
    return [...dataSource];
  };

  getIndeterminate = () => {
    const { rowSelection, dataSource } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const len = selectedRowKeys.length;
    if (len > 0 && len < dataSource.length) {
      return true;
    }
    return false;
  };

  getCheckboxValue = () => {
    const { rowSelection, dataSource } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const len = selectedRowKeys.length;
    const len2 = dataSource.length;
    if (len2 > 0 && len >= dataSource.length) {
      return true;
    }
    return false;
  };

  handleSort = (sorter, field) => {
    const { sorterDirection } = this.state;
    const { onSort } = this.props;
    let direction = 'default';
    if (sorterDirection === 'up') {
      direction = 'down';
    } else if (sorterDirection === 'down') {
      direction = 'default';
    } else {
      direction = 'up';
    }
    if (sorter) {
      this.setState({
        sorterActiveField: field,
        sorterDirection: direction,
      });
      onSort(sorter, direction);
    }
  };

  render() {
    const { columns, rowSelection, dataSource, checkboxWidth, headerCellClassName } = this.props;
    const { sorterActiveField, sorterDirection } = this.state;
    const arr = [];
    if (rowSelection) {
      arr.push(
        <span
          key="lazy-table-columns-key-span"
          className="checkbox"
          style={{
            width: checkboxWidth,
          }}
        >
          <Checkbox
            onChange={this.handleCheckboxChange}
            indeterminate={this.getIndeterminate()}
            checked={this.getCheckboxValue()}
            disabled={dataSource.length === 0}
          />
        </span>
      );
    }
    const len = columns.length;
    return arr.concat(
      columns.map((item, index) => {
        const spanStyle = {
          width: item.width,
        };
        if (index + 1 === len) {
          spanStyle.borderRight = 0;
        }
        const { sorter } = item;
        let spanWidth = item.width - 8;
        if (sorter) {
          spanWidth = item.width - 8 - 4 - 16;
        }
        const value = sorterActiveField === item.dataIndex ? sorterDirection : 'default';
        return (
          <span
            style={spanStyle}
            key={item.key}
            onClick={this.handleSort.bind(this, sorter, item.dataIndex)}
          >
            <div
              className={
                sorter
                  ? `column-item column-has-sorter ${headerCellClassName}`
                  : `column-item ${headerCellClassName}`
              }
            >
              <span
                style={{ maxWidth: spanWidth, display: 'inline-block' }}
                className="column-item-text"
              >
                {item.title}
              </span>
              {sorter ? <Sorter value={value} /> : null}
            </div>
          </span>
        );
      }),
      <span style={{ width: 50 }} key="item.key" />
    );
  }
}
Columns.defaultProps = {
  columns: [],
  rowSelection: null,
  onSort: () => {},
  headerCellClassName: '',
};
Columns.propTypes = {
  columns: PropTypes.array,
  rowSelection: PropTypes.object,
  dataSource: PropTypes.array.isRequired,
  checkboxWidth: PropTypes.number.isRequired,
  onSort: PropTypes.func,
  headerCellClassName: PropTypes.string,
};
export default Columns;
