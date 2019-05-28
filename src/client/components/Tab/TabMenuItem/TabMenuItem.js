import React from 'react';

import Icon from '../../Icon/Icon';

import classnames from 'classnames/bind';

import styles from './TabMenuItem.scss';

const cx = classnames.bind(styles);

const TabMenuItem = ({ name, onMenuItemClick, active, onIconClick, evm }) => {

  const classes = cx({
    'tab-menu-item': true,
    'tab-menu-item--active': !!active,
  });

  return (
    <div className={classes} onClick={onMenuItemClick}>
      {
        !evm && 
        <div onClick={onIconClick} className={styles['tab-menu-item__icon']}>
          <Icon iconName='Cross' />
        </div>
      }
      <div className={'tab-menu-item__text'}>
        <span>{name}</span>
      </div>
    </div>
  );
}


TabMenuItem.displayName = 'TabMenuItem';

export default TabMenuItem;
