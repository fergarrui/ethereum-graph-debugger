import React from 'react';

import classnames from 'classnames/bind';

import styles from '../InnerTab/InnerTabPanel/InnerTabPanel.scss';

const cx = classnames.bind(styles);

const EVMTabPanel = ({ children }) => {

  const tabPanelClasses = cx({
    'inner-tab-panel': true,
    'inner-tab-panel--active': true,
  });

  return (
    <div className={tabPanelClasses}>
      {children}
    </div>
  )
} 

export default EVMTabPanel;