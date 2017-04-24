/**
 * File Name: components/layout/sider.js
 * Created By: bobo2007
 * Creation Date: 2017-04-20 16:01:10
 * Last Modified: 2017-04-20 16:46:19
 * Purpose: 可收起的侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中.
 */

import React from 'react' ;
import classNames from 'classnames';
import omit from 'omit.js';

export default class Sider extends React.Component{

  constructor(props){
    super(props);
    let collapsed;
    if('collapsed' in props){
      collapsed = props.collapsed;
    }else{
      collapsed = props.defaultCollapsed;
    }
    this.state = {
      collapsed
    }
  }

  componentWillReceiveProps(nextProps){
    if ('collapsed' in nextProps) {
      this.setState({
        collapsed: nextProps.collapsed
      });
    }
  }

  setCollapsed = (collapsed) => {
    if (!('collapsed' in nextProps)) {
      this.setState({
        collapsed
      });
    }
    const { onCollapse } = this.props;
    if (onCollapse) {
      onCollapse(collapsed);
    }
  }

  toggle = () => {
    const collapsed = !this.state.collapsed;
    this.setCollapsed(collapsed);
  }

  render() {
    const {
      prefixCls, className, collapsible, reverseArrow, trigger, style, width, collapsedWidth, ...others
    } = this.props;
  }
}
