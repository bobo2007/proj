/**
 * File Name: components/layout/layout.js
 * Created By: bobo2007
 * Creation Date: 2017-04-20 13:29:28
 * Last Modified: 2017-04-20 15:07:30
 * Purpose:
 */

import React from 'react';
import classNames from 'classnames';

function generator(props) {
  return (Basic) => {
    return class Adapter extends React.Component{
      render(){
        const { prefixCls } = props;
        return  <Basic prefixCls={prefixCls} name={props.name} {...this.props} />;
      }
    };
  };
}

class Basic extends React.Component{
  render() {
    const { prefixCls, className, children, name, ...others } = this.props;
    let hasSider;
    if (name === 'Layout') {
      React.Children.forEach(children, (ele) => {
          if (ele && ele.props && ele.props.name  === 'Sider') {
          hasSider = true;
          }
          });
    }
    const divCls = classNames(className, prefixCls, {
        [`${prefixCls}-has-sider`]: hasSider,
        });
    return (
        <div className={divCls} {...others}>{childern}</div>
        );
  }
}

const Layout = generator({
prefixCls: 'boge-layout',
name: 'Layout'
})(Basic);

const Header = generator({
prefixCls: 'boge-layout-header',
name: 'Header'
})(Basic);

const Footer = generator({
prefixCls: 'boge-layout-footer',
name: 'Footer'
})(Basic);

const Content = generator({
prefixCls: 'boge-layout-content',
name: 'Content'
})(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;
