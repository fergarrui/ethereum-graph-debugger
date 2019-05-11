import React from 'react';

import Icon from '../Icon/Icon';

import styles from './TopNavBar.scss';

const TopNavBar = ({ children, onIconClick }) => {

  return (
    <div className={styles['top-navbar']}>
      <div className={styles['top-navbar__form']}>
        {children}
      </div>
      <div onClick={onIconClick} className={styles['top-navbar__icon']}>
        <Icon iconName='Cogs' />
      </div>
    </div>
  )
}

TopNavBar.displayName = 'TopNavBar';

export default TopNavBar;
