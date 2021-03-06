/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

class Row extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleCheckboxChange = e => {
    const { data, rowSelection, dataSource, rowKey } = this.props;
    const { checked } = e.target;

    const { selectedRowKeys = [], onChange = () => {}, onSelect = () => {} } = rowSelection;
    const index = selectedRowKeys.indexOf(data[rowKey]);
    const tem = [...selectedRowKeys];
    if (checked) {
      if (index === -1) {
        tem.push(data[rowKey]);
      }
    } else if (index > -1) {
      tem.splice(index, 1);
    }
    onSelect(data, checked);
    onChange(tem, this.getSelectedRows(tem, dataSource));
  };

  getSelectedRows = (selectedRowKeys, dataSource) => {
    const { rowKey } = this.props;
    const len2 = dataSource.length;
    const selectedRows = [];
    for (let i = 0; i < len2; i += 1) {
      const item = dataSource[i];
      if (selectedRowKeys.indexOf(item[rowKey]) > -1) {
        selectedRows.push(item);
      }
    }
    return selectedRows;
  };

  getCheckboxValue = () => {
    const { rowSelection, data, rowKey } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    if (selectedRowKeys.indexOf(data[rowKey]) > -1) {
      return true;
    }
    return false;
  };

  defaultCheckboxProps = () => {
    return {
      disabled: false,
    };
  };

  getCurrentColumnsWidth = () => {
    const { columns } = this.props;
    const len = columns.length;
    const arr = [];
    let total = 0;
    for (let i = 0; i < len; i += 1) {
      const item = columns[i];
      arr.push({
        ...item,
        currentWidth: total,
      });
      total += item.width;
    }
    return arr;
  };

  renderRowHtml = () => {
    const {
      rowKey,
      data,
      // columns,
      rowSelection,
      checkboxWidth,
      onCellObj,
      rowCellClassName,
      offsetWidth,
      scrollLeft,
      noHorizonalVirtualization,
    } = this.props;
    const columns = this.getCurrentColumnsWidth();
    const arr = [];
    if (rowSelection) {
      const { getCheckboxProps = this.defaultCheckboxProps } = rowSelection;
      const checkboxProps = getCheckboxProps(data);
      arr.push(
        <span
          className="checkbox"
          key="lazy-table-row-key-span"
          style={{
            width: checkboxWidth,
          }}
        >
          <Checkbox
            onChange={this.handleCheckboxChange}
            checked={this.getCheckboxValue()}
            {...checkboxProps}
          />
        </span>
      );
    }

    const htmlArr = columns.map((item, index) => {
      const { currentWidth } = item;
      const spanStyle = {
        width: item.width,
      };
      const key = `${item[rowKey]}u${index}`;
      const widthDt = currentWidth - scrollLeft;

      if (
        noHorizonalVirtualization ||
        (widthDt <= offsetWidth + item.width && widthDt >= -offsetWidth)
      ) {
        if (item.render) {
          return (
            <span style={spanStyle} key={key} {...onCellObj}>
              <div className={`span-item ${rowCellClassName}`}>
                {item.render(data[item.dataIndex], data)}
              </div>
            </span>
          );
        }
        return (
          <span style={spanStyle} key={key} {...onCellObj}>
            <div className={`span-item ${rowCellClassName}`}>{data[item.dataIndex]}</div>
          </span>
        );
      }
      return <span style={spanStyle} key={key} />;
    });
    return arr.concat(htmlArr);
  };

  render() {
    const { data, height, rowClassName, onRowObj } = this.props;

    const style = {
      height,
    };

    if (!data) {
      return <div className={`row ${rowClassName}`} style={style} />;
    }

    return (
      <div className={`row ${rowClassName}`} style={style} {...onRowObj}>
        {this.renderRowHtml()}
      </div>
    );
  }
}
Row.defaultProps = {
  data: null,
  columns: [],
  rowSelection: null,
  rowClassName: '',
  onRowObj: {},
  onCellObj: {},
  rowCellClassName: '',
};
Row.propTypes = {
  data: PropTypes.object,
  height: PropTypes.number.isRequired,
  columns: PropTypes.array,
  rowKey: PropTypes.string.isRequired,
  rowSelection: PropTypes.object,
  dataSource: PropTypes.array.isRequired,
  rowClassName: PropTypes.string,
  checkboxWidth: PropTypes.number.isRequired,
  onRowObj: PropTypes.object,
  onCellObj: PropTypes.object,
  rowCellClassName: PropTypes.string,
};
export default Row;
