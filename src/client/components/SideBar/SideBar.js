import React from 'react';
import cx from 'classnames';

import styles from './SideBar.scss';

export const SideBarItem = ({ className, label, onClick }) => {
  const onItemClick = type => {
    onClick(type)
  }

  return (
    <div className={cx(styles['side-bar__item'], className)} onClick={onItemClick}>{label}</div>
  )
}

export const SideBar = ({ className, children }) => {
  return (
    <div className={cx(styles['side-bar'], className)}>
    {children}
    </div>
  )
}

SideBar.displayName = 'SideBar';

export default SideBar;
