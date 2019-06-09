import React from 'react';

import styles from './Popup.scss';

const Popup = ({ children }) => {
  return (
    <div className={styles['popup']}>
     {children}
    </div>
  )
}

export default Popup;