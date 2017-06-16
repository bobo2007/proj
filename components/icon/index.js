/**
 * File Name: components/icon/index.js
 * Created By: bobo2007
 * Creation Date: 2017-06-16 10:47:38
 * Last Modified: 2017-06-16 11:42:22
 * Purpose: icon 组件
 */


import React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';

const Icon = (props) => {
  const { type, className='', spin } = props;
  const classString = classNames({
    bogeicon: true,
    'bogeicon-spin': !!spin || type ==='loading',
    [`bogeicon-${type}`]: true
  },className);
  return <i {...omit(props,['type','spin'])} className={classString} />;
};

export default Icon;
