/**
 * File Name: src/home/index.js
 * Created By: bobo2007
 * Creation Date: 2017-04-19 15:52:39
 * Last Modified: 2017-06-15 22:57:08
 * Purpose: home 首页
 */

import React, { PropTypes } from 'react';
import { html, title } from './index.md';
import './../../components/layout/style/index.less';
import './../../components/layout/style/demo.less';
import Layout from '../../components/layout';

const { Header, Footer, Content, Sider } = Layout;

class HomePage extends React.Component {
  componentDidMount() {
    document.title = title;
  }
  render() {
    return  (<div>
        <div id='components-layout-demo-basic'>
          <Layout>
            <Header>Header</Header>
            <Sider>sider</Sider>
            <Content>Content</Content>
            <Footer>Footer</Footer>
          </Layout>
        </div>
      </div>);
  }
}

export default HomePage;
