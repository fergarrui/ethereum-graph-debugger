import React from 'react';

import Input from '../Input/Input';
import Icon from '../Icon/Icon';

import styles from '../../styles/TopNavBar.scss';

const TopNavBar = ({ onInputChange, onInputSubmit, onIconClick }) => {

  return (
    <div className={styles['top-navbar']}>
      <div className={styles['top-navbar__input']}>
        <Input 
          placeholder='Insert contracts path' 
          buttonValue='Load contracts from URI'
          onChange={onInputChange}
          onSubmit={onInputSubmit} 
        />
      </div>
        <div onClick={onIconClick} className={styles['top-navbar__icon']}>
          <Icon iconName='Cogs' />
        </div>
      </div>
  )
}

TopNavBar.displayName = 'TopNavBar';

export default TopNavBar;
