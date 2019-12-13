import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

function getClassName(val1, val2) {
  if (val1 === val2) {
    return 'active';
  }
  return '';
}
class Sorter extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value } = this.props;
    return (
      <div className="sort-box">
        <div className={`up ${getClassName(value, 'up')}`}>
          <Icon type="caret-up" />
        </div>
        <div className={`down ${getClassName(value, 'down')}`}>
          <Icon type="caret-down" />
        </div>
      </div>
    );
  }
}

Sorter.defaultProps = {
  value: 'default',
};
Sorter.propTypes = {
  value: PropTypes.string,
};
export default Sorter;
