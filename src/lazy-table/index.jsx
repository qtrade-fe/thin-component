/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import { Spin } from 'antd';
import Row from './row';
import Columns from './columns';
import MyEmpty from './empty';

const noop = () => {};

let domCount = 1;
class LazyTable extends React.Component {
  constructor() {
    super();
    domCount += 1;
    this.state = {
      columnId: `LazyTableColumnId${domCount}`,
      tableId: `LazyTablerowTableId${domCount}`,
      scrollTop: 0,
      loadingLeft: 0,
      loadingTop: 0,
      checkboxWidth: 40,
      tableWidth: 0,
      columnSize: [],
      offsetWidth: 0,
      scrollLeft: 0,
    };
  }

  componentDidMount() {
    const { tableId } = this.state;
    const tableDom = document.getElementById(tableId);
    const { offsetWidth, scrollLeft } = tableDom;
    this.setState({
      tableWidth: offsetWidth,
      offsetWidth,
      scrollLeft,
    });
    tableDom.onscroll = this.handleScroll;
    window.addEventListener('resize', this.windowResize);
  }

  componentWillUnmount() {
    const { tableId } = this.state;
    const tableDom = document.getElementById(tableId);
    if (tableDom) {
      tableDom.onscroll = null;
    }
    window.removeEventListener('resize', this.windowResize);
  }

  windowResize = () => {
    const { tableId } = this.state;
    const tableDom = document.getElementById(tableId);
    if (tableDom) {
      this.setState({
        tableWidth: tableDom.offsetWidth,
      });
      setTimeout(() => {
        if (tableDom) {
          this.handleScroll({ target: tableDom });
        }
      }, 10);
    }
  };

  handleScroll = e => {
    console.log('thin-component 3.1.4');
    const { onScrollBottom, bottomLimit, lazyLoading } = this.props;
    const { columnId } = this.state;
    const columnDom = document.getElementById(columnId);
    const { scrollTop, scrollLeft, scrollHeight, offsetHeight, offsetWidth } = e.target;
    columnDom.style.left = `${-e.target.scrollLeft}px`;
    this.setState({
      scrollTop,
      loadingLeft: scrollLeft,
      loadingTop: scrollTop,
      offsetWidth,
      scrollLeft,
      tableWidth: offsetWidth,
    });
    const val = scrollHeight - scrollTop - offsetHeight;
    if (val < bottomLimit) {
      onScrollBottom(lazyLoading);
    }
  };

  isInView = (index, y) => {
    const { rowHeight } = this.props;
    const viewNumber = parseInt(y / rowHeight, 10) + 1;
    const { scrollTop } = this.state;
    const min = scrollTop - 2 * rowHeight;
    const max = scrollTop + (viewNumber + 2) * rowHeight;
    const val = index * rowHeight;
    if (val > min && val < max) {
      return true;
    }
    return false;
  };

  renderLoading = () => {
    const { loading, tip } = this.props;
    const { loadingLeft, loadingTop } = this.state;
    const s = {
      left: loadingLeft,
      top: loadingTop,
    };
    if (loading) {
      return (
        <div className="first-loading-box" style={s}>
          <div className="first-loading-content">
            <Spin size="small" tip={tip} />
          </div>
        </div>
      );
    }
    return null;
  };

  renderLoadingMore = () => {
    const { loadingElement, loadingTip } = this.props;
    return (
      <div className="loading-box">
        <div className="loading-box-content">
          {loadingElement || <Spin tip={loadingTip} size="small" />}
        </div>
      </div>
    );
  };

  getTotalWidth = () => {
    const { columns, rowSelection } = this.props;
    const { checkboxWidth } = this.state;
    let width = 0;
    columns.forEach(item => {
      width += item.width;
    });
    if (rowSelection) {
      width += checkboxWidth;
    }
    return width;
  };

  getBoxStyle = (len, y, totalWidth, isEmpty, lazyLoading) => {
    const { rowHeight, isScrollX } = this.props;
    const { tableWidth } = this.state;
    const style = {
      paddingTop: rowHeight,
      maxHeight: y + rowHeight,
    };
    if (y > rowHeight * len) {
      let addHeight = 0;
      if (totalWidth > tableWidth && isScrollX) {
        addHeight = 14;
      }
      const f = !isEmpty && lazyLoading ? rowHeight : 0;
      style.height = rowHeight * len + rowHeight + addHeight + f;
    }
    if (len === 0) {
      style.height = style.maxHeight;
    }
    return style;
  };

  handleSort = (sorter, direction, column) => {
    this.setState({
      currentSorter: sorter,
      currentDirection: direction,
    });
    const { onChange } = this.props;
    // pagination, filters, sorter, extra
    const orderMap = {
      default: undefined,
      down: 'descend',
      up: 'ascend',
    };
    onChange(
      {},
      {},
      {
        column,
        order: orderMap[direction],
        field: column.dataIndex,
        columnKey: column.key,
      },
      {}
    );
  };

  getSortedDataSource = dataSource => {
    const { currentSorter, currentDirection } = this.state;
    const { columns } = this.props;
    const sortOrderLength = columns.filter(item => {
      return typeof item.sortOrder === 'boolean' && item.sortOrder === false;
    }).length;
    if (sortOrderLength === columns.length) {
      return dataSource;
    }

    const copyData = [...dataSource];
    if (currentSorter) {
      if (currentDirection === 'default') {
        return dataSource;
      }
      if (currentDirection === 'up') {
        return copyData.sort(currentSorter);
      }
      return copyData.sort(currentSorter).reverse();
    }
    return dataSource;
  };

  resetWidth = () => {
    this.setState({
      columnSize: [],
    });
  };

  handleResizeColumn = (e, index, { size }) => {
    const { columns, onWidthResize } = this.props;
    const { columnSize } = this.state;
    const copy = [...columnSize];
    if (!copy[index]) {
      copy[index] = 0;
    }
    const minWidth = 48;
    const bf = copy[index];
    copy[index] = size.width - columns[index].width;
    if (copy[index] + columns[index].width <= minWidth) {
      copy[index] = bf;
    }

    this.setState(
      {
        columnSize: copy,
      },
      () => {
        const { columns: columns2 } = this.props;
        if (onWidthResize) {
          const resizedColumn = this.getResizedColumn(columns2);
          onWidthResize(resizedColumn);
          this.setState({
            columnSize: [],
          });
        }
      }
    );
  };

  getResizedColumn = columns => {
    const { columnSize } = this.state;
    const arr = [];
    const len = columns.length;

    for (let i = 0; i < len; i += 1) {
      const item = columns[i];
      const w = columnSize[i] ? columnSize[i] : 0;
      const cp = { ...item };
      cp.width += w;
      arr.push(cp);
    }
    return arr;
  };

  render() {
    const {
      columns,
      dataSource,
      rowHeight,
      rowKey,
      lazyLoading,
      rowSelection,
      scroll,
      rowClassName,
      onRow,
      onCell,
      rowCellClassName,
      headerCellClassName,
      isResizeColumn,
      noHorizonalVirtualization,
    } = this.props;
    const { y } = scroll;
    const { columnId, tableId, checkboxWidth, offsetWidth, scrollLeft } = this.state;
    const columnStyle = {
      height: rowHeight,
    };
    const len = dataSource.length;
    const isEmpty = len === 0;
    const totalWidth = this.getTotalWidth();
    const boxStyle = this.getBoxStyle(len, y, totalWidth, isEmpty, lazyLoading);

    const resizedColumn = this.getResizedColumn(columns);
    const lazyStyle = { maxHeight: y };

    return (
      <div
        className="lazy-table-table-box-wrap"
        style={boxStyle}
        ref={ref => {
          this.myref = ref;
        }}
      >
        <div className="lazy-table-table-box" id={tableId} style={lazyStyle}>
          {this.renderLoading()}
          <div className="table">
            <div className="table-column" id={columnId}>
              <div className="column-content">
                <div className="row row-column" style={columnStyle}>
                  <Columns
                    isResizeColumn={isResizeColumn}
                    onResize={this.handleResizeColumn}
                    headerCellClassName={headerCellClassName}
                    checkboxWidth={checkboxWidth}
                    columns={resizedColumn}
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                    rowKey={rowKey}
                    onSort={this.handleSort}
                  />
                </div>
              </div>
            </div>

            {isEmpty ? (
              <div style={{ width: totalWidth }}>
                <MyEmpty y={y} myref={this} />
              </div>
            ) : null}

            {this.getSortedDataSource(dataSource).map((item, index) => {
              const flag = this.isInView(index, y);
              return (
                <Row
                  rowCellClassName={rowCellClassName}
                  onRowObj={onRow(item, index)}
                  onCellObj={onCell(item, index)}
                  checkboxWidth={checkboxWidth}
                  rowClassName={rowClassName(item, index)}
                  dataSource={dataSource}
                  rowSelection={rowSelection}
                  data={flag ? item : null}
                  key={item[rowKey]}
                  height={rowHeight}
                  columns={resizedColumn}
                  rowKey={rowKey}
                  offsetWidth={offsetWidth}
                  scrollLeft={scrollLeft}
                  noHorizonalVirtualization={noHorizonalVirtualization}
                />
              );
            })}
            {!isEmpty && lazyLoading ? (
              <div className="row" style={columnStyle}>
                {this.renderLoadingMore()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
LazyTable.defaultProps = {
  scroll: {},
  rowHeight: 40,
  onScrollBottom: noop,
  bottomLimit: 50,
  lazyLoading: false,
  rowSelection: null,
  loadingElement: null,
  loadingTip: '正在加载更多...',
  tip: '加载中..',
  rowClassName: () => {
    return '';
  },
  loading: false,
  // Function(record, index)
  onRow: () => {
    return {};
  },
  onCell: () => {
    return {};
  },
  rowCellClassName: '',
  headerCellClassName: '',
  isResizeColumn: true,
  isScrollX: true,
  onChange: () => {},
  onWidthResize: null,
};
LazyTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  scroll: PropTypes.object,
  rowHeight: PropTypes.number,
  rowKey: PropTypes.string.isRequired,
  onScrollBottom: PropTypes.func,
  bottomLimit: PropTypes.number,
  lazyLoading: PropTypes.bool,
  rowSelection: PropTypes.object,
  loadingElement: PropTypes.element,
  loadingTip: PropTypes.string,
  rowClassName: PropTypes.func,
  loading: PropTypes.bool,
  tip: PropTypes.string,
  onRow: PropTypes.func,
  onCell: PropTypes.func,
  rowCellClassName: PropTypes.string,
  headerCellClassName: PropTypes.string,
  isResizeColumn: PropTypes.bool,
  isScrollX: PropTypes.bool,
  onChange: PropTypes.func,
  onWidthResize: PropTypes.func,
};
export default LazyTable;
