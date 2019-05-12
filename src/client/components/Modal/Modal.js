import React from 'react';

import Icon from '../Icon/Icon';

import styles from './Modal.scss';

const Modal =  ({ onIconClick, children }) => {

  return (
    <div className={styles['modal']}>
      <div className={styles['modal__main']}>
        <div className={styles['modal__main__button']}>
          <button onClick={onIconClick}>
            <Icon iconName='Cross' />
          </button>
        </div>
        <div className={styles['modal__main__body']}>
          {children}
        </div>
      </div>
    </div>
  )
} 

Modal.displayName = 'Modal';

export default Modal;
