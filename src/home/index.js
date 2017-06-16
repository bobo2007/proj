/**
 * File Name: src/home/index.js
 * Created By: bobo2007
 * Creation Date: 2017-04-19 15:52:39
 * Last Modified: 2017-06-16 23:48:24
 * Purpose: home 首页
 */

import React, { PropTypes } from 'react';
import { html, title } from './index.md';
import './../../components/layout/style/index.less';
import './../../components/layout/style/demo.less';
import Layout from '../../components/layout';

const { Header, Footer, Content, Sider } = Layout;

class HomePage extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline'
  };
  componentDidMount() {
    document.title = title;
  }
  render() {
    return  (
        <div id='components-layout-demo-basic'>
          <Layout className="boge-layout-has-sider">
            <Sider  collapsible collapsed={this.state.collapsed}>sider</Sider>
            <Layout>
              <Header>Header</Header>
              <Content>Content</Content>
              <Footer>Footer</Footer>
            </Layout>
          </Layout>
      </div>);
  }
}

export default HomePage;
