import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import pic from './empty-pic.png';

class MyEmpty extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { y } = this.props;
    return (
      <div className="empty-box" style={{ height: y - 20 }}>
        <div className="empty-box-none-select" />
        <Empty
          image={pic}
          imageStyle={{
            height: 60,
          }}
          description="暂无数据"
        />
      </div>
    );
  }
}
MyEmpty.propTypes = {
  y: PropTypes.number.isRequired,
};
export default MyEmpty;
