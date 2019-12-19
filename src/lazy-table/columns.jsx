/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { Resizable } from 'react-resizable';
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
    const { rowSelection, dataSource, rowKey } = this.props;
    const { checked } = e.target;

    const { onChange = () => {}, onSelectAll = () => {}, selectedRowKeys = [] } = rowSelection;
    let tem = [];
    let selectedRows = [];
    if (checked) {
      tem = dataSource.map(item => {
        return item[rowKey];
      });
      selectedRows = [...dataSource];
    }

    onChange(tem, selectedRows);
    const changeRows = this.getChangeRows(dataSource, checked, selectedRowKeys);
    onSelectAll(checked, selectedRows, changeRows);
  };

  getChangeRows = (dataSource, checked, selectedRowKeys) => {
    const { rowKey } = this.props;
    const allKeys = dataSource.map(item => {
      return item[rowKey];
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
        return changeRows.indexOf(item[rowKey]) > -1;
      });
    }
    return [...dataSource];
  };

  getIndeterminate = checked => {
    const { rowSelection } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const len = selectedRowKeys.length;

    if (!checked && len > 0) {
      return true;
    }
    return false;
  };

  getCheckboxValue = () => {
    const { rowSelection, dataSource, rowKey } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const len2 = dataSource.length;
    if (len2 === 0) {
      return false;
    }
    let flag = true;
    for (let i = 0; i < len2; i += 1) {
      const key = dataSource[i][rowKey];
      if (selectedRowKeys.indexOf(key) === -1) {
        flag = false;
        break;
      }
    }
    return flag;
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

  renderHandleHtml = () => {
    const { isResizeColumn } = this.props;
    if (!isResizeColumn) {
      return null;
    }
    return (
      <div className="drag-item">
        <div />
      </div>
    );
  };

  render() {
    const {
      columns,
      rowSelection,
      dataSource,
      checkboxWidth,
      headerCellClassName,
      onResize,
    } = this.props;
    const { sorterActiveField, sorterDirection } = this.state;
    const arr = [];
    const checked = this.getCheckboxValue();
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
            indeterminate={this.getIndeterminate(checked)}
            checked={checked}
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
          spanWidth = item.width - 8 - 2 - 12;
        }
        const value = sorterActiveField === item.dataIndex ? sorterDirection : 'default';
        return (
          <Resizable
            key={item.key}
            width={item.width}
            height={0}
            onResize={(e, resizeData) => {
              onResize(e, index, resizeData);
            }}
            axis="both"
            handle={this.renderHandleHtml()}
          >
            <span style={spanStyle}>
              <div
                onClick={this.handleSort.bind(this, sorter, item.dataIndex)}
                className={
                  sorter
                    ? `column-item column-has-sorter ${headerCellClassName}`
                    : `column-item ${headerCellClassName}`
                }
              >
                <span
                  style={{ maxWidth: spanWidth - 2, display: 'inline-block' }}
                  className="column-item-text"
                >
                  {item.title}
                </span>
                {sorter ? <Sorter value={value} /> : null}
              </div>
            </span>
          </Resizable>
        );
      }),
      <span style={{ width: 50 }} key="item.key.Columns.lazy" />
    );
  }
}
Columns.defaultProps = {
  columns: [],
  rowSelection: null,
  onSort: () => {},
  headerCellClassName: '',
  onResize: () => {},
  isResizeColumn: true,
};
Columns.propTypes = {
  columns: PropTypes.array,
  rowSelection: PropTypes.object,
  dataSource: PropTypes.array.isRequired,
  checkboxWidth: PropTypes.number.isRequired,
  onSort: PropTypes.func,
  headerCellClassName: PropTypes.string,
  onResize: PropTypes.func,
  isResizeColumn: PropTypes.bool,
  rowKey: PropTypes.string.isRequired,
};
export default Columns;
