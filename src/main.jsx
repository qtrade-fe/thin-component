import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from '@src/app';

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Router>
      <App />
    </Router>
  </LocaleProvider>,
  document.getElementById('root')
);
