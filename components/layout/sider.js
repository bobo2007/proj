/**
 * File Name: components/layout/sider.js
 * Created By: bobo2007
 * Creation Date: 2017-04-20 16:01:10
 * Last Modified: 2017-06-17 10:51:14
 * Purpose: 可收起的侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中.
 */

import React from 'react' ;
import classNames from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';

console.log('sider');

const dimensionMap = {
  xs: '480px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1600px'
};
export default class Sider extends React.Component{
  static defaultProps = {
    prefixCls: 'boge-layout-sider',
    collapsible: false ,
    defaultCollapsed: false, // 默认不折叠
    reverseArrow: false,
    width: 200, // 展开宽度
    collapsedWidth: 64, // 收缩宽度
    style: {}
  }
  constructor(props){
    super(props);
    let matchMedia;
    if(typeof window  !== 'undefined'){
      matchMedia = window.matchMedia;
    }
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
      this.mql = matchMedia(`(max-width: ${dimensionMap[props.breakpoint]})`);
    }
    let collapsed;
    if('collapsed' in props){
      collapsed = props.collapsed;
    }else{
      // 若没有指定折叠，则使用默认(不折叠)
      collapsed = props.defaultCollapsed;
    }
    this.state = {
      collapsed,
      below: false
    };
  }

  componentDidMount() {
    if(this.mql){
      this.mql.addListener(this.responsiveHandler);
      this.responsiveHandler(this.mql);
    }
  }

  componentWillReceiveProps(nextProps){
    if ('collapsed' in nextProps) {
      this.setState({
        collapsed: nextProps.collapsed
      });
    }
  }

  componentWillUnmount(){
    if (this.mql) {
      this.mql.removeListener(this.responsiveHandler);
    }
  }

  responsiveHandler = (mql) => {
    this.setState({
      below: mql.matches
    });
    if(this.state.collapsed  !== mql.matches){
      this.setCollapsed(mql.matched,'responsive');
    }
  }

  setCollapsed = (collapsed, type) => {
    if (!('collapsed' in this.props)) {
      this.setState({
        collapsed
      });
    }
    const { onCollapse } = this.props;
    if (onCollapse) {
      onCollapse(collapsed, type);
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
    const divProps = omit(others, ['collapsed','defaultCollapsed','onCollapse','breakpoint']);
    // 侧边宽度，根据收缩状态设置收缩宽度或展开宽度
    const siderWidth = this.state.collapsed ? collapsedWidth : width;
    // 收缩宽度设置为0时，出现特殊trigger
    const zeroWidthTrigger = collapsedWidth === 0 || collapsedWidth  === '0' ? (
      <span onClick={this.toggle} classname={`${prefixCls}-zero-width-trigger`}>
         <Icon type="bars" />
      </span>
    ) : null;

    // 折叠状态 icon
    const iconObj = {
      'expand': reverseArrow ? <Icon type="right" /> : <Icon type="left" />,
      'collapsed': reverseArrow ? <Icon type="left" /> : <Icon type="right" />
    };
    const status = this.state.collapsed ? 'collapsed' : 'expanded';
    // 默认触发器
    const defaultTrigger = iconObj[status];
    // 定义触发器dom,不是自定义触发器时，使用特殊触发器或默认触发器
    const triggerDom = (
      trigger  !== null ? zeroWidthTrigger || (
        <div className={`${prefixCls}-trigger`} onClick={this.toggle}>
          {trigger || defaultTrigger}
        </div>
      ) : null
    );
    const divStyle = {
      ...style,
      flex: `0 0 ${siderWidth}px`,
      width: `${siderWidth}px`
    };
    // sider class
    const siderCls = classNames(className, prefixCls, {
      [`${prefixCls}-collapsed`] : !!this.state.collapsed,
      [`${prefixCls}-has-trigger`]: !!trigger,
      [`${prefixCls}-below`]: !!this.state.below,
      [`${prefixCls}-zero-width`]: siderWidth  === 0 || siderWidth  === '0'
    });
    return (
      <div className={siderCls} {...divProps} style={divStyle}>
        {this.props.children}
        {collapsible || (this.state.below && zeroWidthTrigger) ? triggerDom : null}
      </div>
    );
  }
}
